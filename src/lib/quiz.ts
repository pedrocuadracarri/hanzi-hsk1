import type { Word } from '../types'
import { pickDistractors } from './rounds'
import { shuffle, type Rng } from './random'

/** Tipos de pregunta del repaso mixto */
export type QuizKind = 'meaning' | 'reverse' | 'listen' | 'pinyin'

export interface QuizQuestion {
  word: Word
  kind: QuizKind
  /** 4 opciones (incluida la correcta), ya barajadas */
  options: Word[]
}

/** Qué se compara para que dos opciones no sean iguales a la vista/oído */
export const QUIZ_KEY: Record<QuizKind, (w: Word) => string> = {
  meaning: (w) => w.meaning,
  // Se pregunta por el significado: dos opciones con el mismo (二/两) serían ambiguas
  reverse: (w) => w.meaning,
  listen: (w) => w.pinyin,
  pinyin: (w) => w.pinyin,
}

/**
 * Asigna a cada palabra un tipo de pregunta, rotando para que haya variedad.
 * Las palabras nuevas solo reciben preguntas de reconocimiento visual
 * (aún no se han oído ni practicado el pinyin).
 */
export function buildQuiz(words: Word[], pool: Word[], isNew: (w: Word) => boolean, rng: Rng = Math.random): QuizQuestion[] {
  const all: QuizKind[] = shuffle(['meaning', 'reverse', 'listen', 'pinyin'], rng)
  const easy: QuizKind[] = shuffle(['meaning', 'reverse'], rng)
  let a = 0
  let e = 0
  return words.map((word) => {
    const kind = isNew(word) ? easy[e++ % easy.length] : all[a++ % all.length]
    const key = QUIZ_KEY[kind]
    const options = shuffle([word, ...pickDistractors(word, pool, 3, key, rng)], rng)
    return { word, kind, options }
  })
}
