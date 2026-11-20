import { useSyncExternalStore } from 'react'

/** Preferencias de este dispositivo (no se sincronizan) */
export interface Settings {
  /** Velocidad de la voz: 0.5 – 1.1 */
  rate: number
  /** Reproducir audio automáticamente al acertar */
  autoplay: boolean
  /** Pinyin de ayuda bajo el hanzi: siempre, solo en palabras aún no aprendidas, o nunca */
  pinyinMode: 'always' | 'learning' | 'never'
  /** Modo principiante: ruta guiada y ejercicios avanzados bloqueados hasta tener base */
  beginner: boolean
  /** Recordatorio diario: hora «HH:MM» o null si está desactivado */
  reminder: string | null
  /** Respuestas diarias objetivo */
  dailyGoal: number
  /** Tema de color: el del sistema o forzado */
  theme: 'auto' | 'light' | 'dark'
  /** Colorear pinyin y caracteres según el tono */
  toneColors: boolean
}

export const DEFAULT_SETTINGS: Settings = { rate: 0.8, autoplay: true, pinyinMode: 'always', beginner: true, reminder: null, dailyGoal: 20, theme: 'auto', toneColors: true }

const KEY = 'hanzi-settings'
const listeners = new Set<() => void>()

function read(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    const saved = JSON.parse(raw)
    // Migración: el antiguo interruptor pinyinHint pasa a pinyinMode
    if (saved.pinyinMode === undefined && saved.pinyinHint === false) saved.pinyinMode = 'never'
    delete saved.pinyinHint
    return { ...DEFAULT_SETTINGS, ...saved }
  } catch {
    return DEFAULT_SETTINGS
  }
}

let current = read()

function applyTheme() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (current.theme === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', current.theme)
}
applyTheme()

export const getSettings = () => current

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    /* almacenamiento no disponible: se mantiene en memoria */
  }
  applyTheme()
  listeners.forEach((l) => l())
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    getSettings,
  )
}
