/** Datos de trazos de Hanzi Writer (versión fija para que la caché sea estable) */
export const strokeUrl = (char: string) =>
  `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`

export const STROKE_CACHE = 'hanzi-writer-data'

/** Cargador para HanziWriter: usa la caché si existe, si no descarga y guarda */
export async function loadStrokeData(char: string) {
  const url = strokeUrl(char)
  if ('caches' in window) {
    const cache = await caches.open(STROKE_CACHE)
    const hit = await cache.match(url)
    if (hit) return hit.json()
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    await cache.put(url, res.clone())
    return res.json()
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function countCachedStrokes(chars: string[]): Promise<number> {
  if (!('caches' in window)) return 0
  const cache = await caches.open(STROKE_CACHE)
  const keys = new Set((await cache.keys()).map((r) => r.url))
  return chars.filter((c) => keys.has(strokeUrl(c))).length
}

/** Descarga todos los trazos para usarlos sin conexión */
export async function downloadAllStrokes(chars: string[], onProgress: (done: number) => void) {
  let done = 0
  let failed = 0
  const queue = [...chars]
  const worker = async () => {
    while (queue.length) {
      const c = queue.shift()!
      try {
        await loadStrokeData(c)
      } catch {
        failed++
      }
      onProgress(++done)
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  return { failed }
}
