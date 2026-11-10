import type { Streak } from '../types'
import { addDays } from './dates'

export const EMPTY_STREAK: Streak = { current: 0, best: 0, lastDay: null }

/** Registra actividad en `today` */
export function touchStreak(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s
  const current = s.lastDay === addDays(today, -1) ? s.current + 1 : 1
  return { current, best: Math.max(s.best, current), lastDay: today }
}

/** Racha a mostrar: si ayer no hubo actividad, ya está rota */
export function visibleStreak(s: Streak, today: string): number {
  if (s.lastDay === today || s.lastDay === addDays(today, -1)) return s.current
  return 0
}
