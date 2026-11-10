export interface Radical {
  char: string
  meaning: string
}

export type Category =
  | 'número'
  | 'pronombre'
  | 'familia'
  | 'persona'
  | 'comida'
  | 'verbo'
  | 'adjetivo'
  | 'tiempo'
  | 'lugar'
  | 'objeto'
  | 'animal'
  | 'naturaleza'
  | 'medida'
  | 'partícula'
  | 'pregunta'
  | 'saludo'
  | 'adverbio'
  | 'transporte'
  | 'estudio'

export interface Word {
  id: string
  hanzi: string
  pinyin: string
  pinyinNumeric: string
  meaning: string
  emoji: string | null
  radicals: Radical[]
  mnemonic: string
  category: Category
  level: number
  needsReview?: boolean
}

export type Box = 1 | 2 | 3 | 4 | 5

export interface CardProgress {
  wordId: string
  box: Box
  /** Fecha local YYYY-MM-DD a partir de la cual toca repasar */
  due: string
  lastSeen: string | null
  correct: number
  wrong: number
}

export interface Streak {
  current: number
  best: number
  lastDay: string | null
}

export type MatchMode = 'emoji' | 'pinyin' | 'meaning'
