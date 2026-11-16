import { toDay } from './dates'

/** Rutas de ejercicios terminados hoy (solo este dispositivo) */
const KEY = 'hanzi-today-done'

export function doneToday(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}') as { day?: string; done?: string[] }
    return new Set(raw.day === toDay() ? raw.done : [])
  } catch {
    return new Set()
  }
}

export function markDoneToday(path: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ day: toDay(), done: [...doneToday().add(path)] }))
  } catch {
    /* sin almacenamiento */
  }
}
