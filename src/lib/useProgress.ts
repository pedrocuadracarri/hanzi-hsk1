import { useEffect, useState } from 'react'
import type { CardProgress, Streak } from '../types'
import { getAllProgress, getDaily, getStreak, progressEvents } from './storage'
import { EMPTY_STREAK } from './streak'

export interface ProgressState {
  loaded: boolean
  progress: Record<string, CardProgress>
  streak: Streak
  daily: Record<string, number>
}

/** Progreso guardado; se recarga solo cuando cambia (respuestas, importación, sincronización) */
export function useProgress(): ProgressState {
  const [state, setState] = useState<ProgressState>({ loaded: false, progress: {}, streak: EMPTY_STREAK, daily: {} })
  useEffect(() => {
    let alive = true
    const load = () =>
      Promise.all([getAllProgress(), getStreak(), getDaily()]).then(([progress, streak, daily]) => {
        if (alive) setState({ loaded: true, progress, streak, daily })
      })
    load()
    progressEvents.addEventListener('change', load)
    progressEvents.addEventListener('import', load)
    return () => {
      alive = false
      progressEvents.removeEventListener('change', load)
      progressEvents.removeEventListener('import', load)
    }
  }, [])
  return state
}
