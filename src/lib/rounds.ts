import type { CardProgress, MatchMode, Word } from '../types'
import { shuffle, type Rng } from './random'
import { isDue } from './srs'

export const ROUND_SIZE = 5

/** Texto/emoji que se empareja con el hanzi en cada modo */
export function answerFor(word: Word, mode: MatchMode): string {
  if (mode === 'emoji') return word.emoji ?? ''
  if (mode === 'pinyin') return word.pinyin
  return word.meaning
}

export function eligibleWords(words: Word[], mode: MatchMode): Word[] {
  return mode === 'emoji' ? words.filter((w) => w.emoji) : words
}

/** Opciones incorrectas para un test: otras palabras cuya respuesta sea distinta
 *  (y distinta entre sí), preferiblemente de la misma categoría para que cueste más. */
export function pickDistractors(word: Word, pool: Word[], n: number, key: (w: Word) => string, rng: Rng = Math.random): Word[] {
  const used = new Set([key(word)])
  const candidates = [
    ...shuffle(pool.filter((w) => w.category === word.category), rng),
    ...shuffle(pool.filter((w) => w.category !== word.category), rng),
  ]
  const out: Word[] = []
  for (const w of candidates) {
    if (out.length >= n) break
    const k = key(w)
    if (w.id === word.id || used.has(k)) continue
    used.add(k)
    out.push(w)
  }
  return out
}

interface RoundOptions {
  words: Word[]
  progress: Record<string, CardProgress>
  mode: MatchMode
  today: string
  size?: number
  rng?: Rng
}

/**
 * Elige las palabras de una ronda, por prioridad:
 * 1. Pendientes de repaso (caja más baja y más atrasadas primero)
 * 2. Palabras nuevas (en orden del temario)
 * 3. Relleno aleatorio con palabras ya vistas
 * Nunca repite una respuesta (p. ej. 他/她 = «tā» en modo pinyin).
 */
export function buildRound({ words, progress, mode, today, size = ROUND_SIZE, rng = Math.random }: RoundOptions): Word[] {
  const pool = eligibleWords(words, mode)

  const due = shuffle(
    pool.filter((w) => progress[w.id] && isDue(progress[w.id], today)),
    rng,
  ).sort((a, b) => {
    const pa = progress[a.id]
    const pb = progress[b.id]
    return pa.box - pb.box || pa.due.localeCompare(pb.due)
  })
  const fresh = pool.filter((w) => !progress[w.id])
  const rest = shuffle(
    pool.filter((w) => progress[w.id] && !isDue(progress[w.id], today)),
    rng,
  )

  const picked: Word[] = []
  const answers = new Set<string>()
  for (const w of [...due, ...fresh, ...rest]) {
    if (picked.length >= size) break
    const ans = answerFor(w, mode)
    if (answers.has(ans)) continue
    answers.add(ans)
    picked.push(w)
  }
  return picked
}
