import { exportSnapshot, importSnapshot, progressEvents } from './storage'
import { isSnapshot } from './snapshot'

/** Sincronización opcional entre dispositivos usando un Gist privado de GitHub.
 *  El usuario pega su propio token (solo permiso «gist») en cada dispositivo. */

const KEY = 'hanzi-sync'
const FILE = 'hanzi-hsk1-progreso.json'
const API = 'https://api.github.com'

export interface SyncConfig {
  token: string
  gistId?: string
  lastSync?: string
}

export function getSyncConfig(): SyncConfig | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SyncConfig) : null
  } catch {
    return null
  }
}

export function setSyncConfig(cfg: SyncConfig | null) {
  try {
    if (cfg) localStorage.setItem(KEY, JSON.stringify(cfg))
    else localStorage.removeItem(KEY)
  } catch {
    /* sin almacenamiento */
  }
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (res.status === 401) throw new Error('Token no válido o caducado.')
  if (!res.ok) throw new Error(`GitHub respondió ${res.status}.`)
  return res.json()
}

async function findGist(token: string): Promise<string | undefined> {
  const list = (await gh(token, '/gists?per_page=100')) as { id: string; files: Record<string, unknown> }[]
  return list.find((g) => FILE in g.files)?.id
}

let running: Promise<string> | null = null

/** Descarga la copia remota, la fusiona con la local y sube el resultado.
 *  Devuelve la fecha ISO de la sincronización. */
export function syncNow(): Promise<string> {
  if (running) return running
  running = (async () => {
    const cfg = getSyncConfig()
    if (!cfg?.token) throw new Error('La sincronización no está configurada.')
    let gistId = cfg.gistId ?? (await findGist(cfg.token))

    if (gistId) {
      const gist = await gh(cfg.token, `/gists/${gistId}`)
      const file = gist.files?.[FILE]
      if (file) {
        const content: string = file.truncated ? await (await fetch(file.raw_url)).text() : file.content
        const remote = JSON.parse(content)
        if (isSnapshot(remote)) await importSnapshot(remote)
      }
    }

    const body = JSON.stringify({ files: { [FILE]: { content: JSON.stringify(await exportSnapshot()) } } })
    if (gistId) {
      await gh(cfg.token, `/gists/${gistId}`, { method: 'PATCH', body })
    } else {
      const created = await gh(cfg.token, '/gists', {
        method: 'POST',
        body: JSON.stringify({ description: 'Progreso de Hanzi HSK 1', public: false, ...JSON.parse(body) }),
      })
      gistId = created.id as string
    }
    const lastSync = new Date().toISOString()
    setSyncConfig({ ...cfg, gistId, lastSync })
    return lastSync
  })().finally(() => {
    running = null
  })
  return running
}

/** Sincroniza al abrir la app y al salir de ella (si está configurado) */
export function startAutoSync() {
  const run = () => {
    if (getSyncConfig()?.token && navigator.onLine) syncNow().catch(() => {})
  }
  run()
  // Tras responder, sincroniza cuando el usuario lleve un rato sin actividad
  let timer: ReturnType<typeof setTimeout> | undefined
  progressEvents.addEventListener('change', () => {
    clearTimeout(timer)
    timer = setTimeout(run, 15000)
  })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') run()
  })
}
