import { useSearchParams } from 'react-router-dom'
import type { CardProgress, Word } from '../types'
import { ALL_WORDS } from '../data'
import { isLearned } from './srs'

/** Ruta guiada: el temario en unidades de 5 palabras, en orden de aprendizaje */
export const UNIT_SIZE = 5

export const UNITS: Word[][] = Array.from({ length: Math.ceil(ALL_WORDS.length / UNIT_SIZE) }, (_, i) =>
  ALL_WORDS.slice(i * UNIT_SIZE, (i + 1) * UNIT_SIZE),
)

export type UnitStatus = 'learned' | 'seen' | 'current' | 'locked'

export function unitStats(unit: Word[], progress: Record<string, CardProgress>) {
  const seen = unit.filter((w) => progress[w.id]).length
  const learned = unit.filter((w) => progress[w.id] && isLearned(progress[w.id])).length
  return { seen, learned, total: unit.length }
}

/** Unidad en curso: la primera con palabras sin ver (o la última si ya las viste todas) */
export function currentUnitIndex(progress: Record<string, CardProgress>): number {
  const i = UNITS.findIndex((u) => u.some((w) => !progress[w.id]))
  return i < 0 ? UNITS.length - 1 : i
}

export function unitStatus(i: number, progress: Record<string, CardProgress>): UnitStatus {
  const { seen, learned, total } = unitStats(UNITS[i], progress)
  if (learned === total) return 'learned'
  if (seen === total) return 'seen'
  return i === currentUnitIndex(progress) ? 'current' : 'locked'
}

/** ?unidad=3 en la URL de un ejercicio: practicar solo esa unidad */
export function useUnitParam(): { index: number; words: Word[] } | undefined {
  const raw = useSearchParams()[0].get('unidad')
  const index = raw === null ? NaN : Number(raw)
  return UNITS[index] ? { index, words: UNITS[index] } : undefined
}

/** Pasos de cada unidad ya hechos alguna vez (solo este dispositivo) */
export type UnitStep = 'conocer' | 'emparejar' | 'escuchar' | 'tarjetas'
const STEPS_KEY = 'hanzi-unit-steps'

function readSteps(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(STEPS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export const unitSteps = (i: number) => new Set(readSteps()[i] ?? [])

export function markUnitStep(i: number, step: string) {
  const all = readSteps()
  all[i] = [...new Set([...(all[i] ?? []), step])]
  try {
    localStorage.setItem(STEPS_KEY, JSON.stringify(all))
  } catch {
    /* sin almacenamiento */
  }
}
