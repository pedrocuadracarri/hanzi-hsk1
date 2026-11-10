import type { Box, CardProgress } from '../types'
import { addDays } from './dates'

/** Días hasta el próximo repaso según la caja Leitner */
export const INTERVALS: Record<Box, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 }

/** A partir de esta caja la palabra cuenta como aprendida */
export const LEARNED_BOX: Box = 3

export function newCard(wordId: string, today: string): CardProgress {
  return { wordId, box: 1, due: today, lastSeen: null, correct: 0, wrong: 0 }
}

/** Acierto: sube una caja. Fallo: vuelve a la caja 1 (repaso hoy mismo). */
export function review(card: CardProgress, correct: boolean, today: string): CardProgress {
  const box = (correct ? Math.min(5, card.box + 1) : 1) as Box
  return {
    ...card,
    box,
    due: addDays(today, INTERVALS[box]),
    lastSeen: today,
    correct: card.correct + (correct ? 1 : 0),
    wrong: card.wrong + (correct ? 0 : 1),
  }
}

export const isDue = (card: CardProgress, today: string) => card.due <= today
export const isLearned = (card: CardProgress) => card.box >= LEARNED_BOX

export function countDue(progress: Record<string, CardProgress>, today: string): number {
  return Object.values(progress).filter((c) => isDue(c, today)).length
}
