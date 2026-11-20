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
