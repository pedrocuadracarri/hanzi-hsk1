import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardProgress, Word } from '../types'
import { getAllProgress, recordAnswer } from '../lib/storage'
import { toDay } from '../lib/dates'

export type Stage = 'loading' | 'intro' | 'play' | 'done'

/** Flujo común de una ronda: elegir palabras → presentar las nuevas → jugar → resumen.
 *  `pick` decide qué palabras entran (normalmente con buildRound). */
export function useWordSession(
  pick: (progress: Record<string, CardProgress>, today: string) => Word[],
  deps: unknown[] = [],
  { intro = true, record = true }: { intro?: boolean; record?: boolean } = {},
) {
  const [stage, setStage] = useState<Stage>('loading')
  const [words, setWords] = useState<Word[]>([])
  const [newWords, setNewWords] = useState<Word[]>([])
  const [roundKey, setRoundKey] = useState(0)
  const results = useRef(new Map<string, boolean>())
  const pickRef = useRef(pick)
  pickRef.current = pick

  const start = useCallback(async () => {
    setStage('loading')
    const progress = await getAllProgress()
    const ws = pickRef.current(progress, toDay())
    results.current = new Map()
    setWords(ws)
    const fresh = ws.filter((w) => !progress[w.id])
    setNewWords(fresh)
    setRoundKey((k) => k + 1)
    setStage(fresh.length && intro ? 'intro' : 'play')
  }, [intro])

  useEffect(() => {
    start()
  }, [start, ...deps])

  /** Registra la respuesta (solo la primera vez por palabra en la ronda) */
  const answer = useCallback((wordId: string, correct: boolean) => {
    if (results.current.has(wordId)) return
    results.current.set(wordId, correct)
    if (record) void recordAnswer(wordId, correct)
  }, [record])

  return {
    stage,
    words,
    newWords,
    roundKey,
    results: results.current,
    answer,
    play: () => setStage('play'),
    finish: () => setStage('done'),
    restart: start,
  }
}
