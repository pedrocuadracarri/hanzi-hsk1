import type { Word } from '../types'
import hsk1 from './hsk1.json'

// Para añadir HSK 2: importar hsk2.json y añadirlo aquí.
export const LEVELS: Record<number, Word[]> = {
  1: hsk1 as Word[],
}

export const ALL_WORDS: Word[] = Object.values(LEVELS).flat()

const byId = new Map(ALL_WORDS.map((w) => [w.id, w]))
export const getWord = (id: string): Word | undefined => byId.get(id)
