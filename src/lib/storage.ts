import { openDB, type DBSchema } from 'idb'
import type { CardProgress, Streak } from '../types'
import { toDay } from './dates'
import { newCard, review } from './srs'
import { EMPTY_STREAK, touchStreak } from './streak'

interface HanziDB extends DBSchema {
  progress: { key: string; value: CardProgress }
  meta: { key: string; value: unknown }
}

const dbPromise = openDB<HanziDB>('hanzi-hsk', 1, {
  upgrade(db) {
    db.createObjectStore('progress', { keyPath: 'wordId' })
    db.createObjectStore('meta')
  },
})

export async function getAllProgress(): Promise<Record<string, CardProgress>> {
  const all = await (await dbPromise).getAll('progress')
  return Object.fromEntries(all.map((c) => [c.wordId, c]))
}

export async function getStreak(): Promise<Streak> {
  return ((await (await dbPromise).get('meta', 'streak')) as Streak | undefined) ?? EMPTY_STREAK
}

/** Guarda el resultado de una tarjeta y actualiza la racha */
export async function recordAnswer(wordId: string, correct: boolean): Promise<CardProgress> {
  const today = toDay()
  const db = await dbPromise
  const tx = db.transaction(['progress', 'meta'], 'readwrite')
  const card = (await tx.objectStore('progress').get(wordId)) ?? newCard(wordId, today)
  const updated = review(card, correct, today)
  await tx.objectStore('progress').put(updated)
  const streak = ((await tx.objectStore('meta').get('streak')) as Streak | undefined) ?? EMPTY_STREAK
  await tx.objectStore('meta').put(touchStreak(streak, today), 'streak')
  await tx.done
  return updated
}

export async function resetProgress(): Promise<void> {
  const db = await dbPromise
  await db.clear('progress')
  await db.clear('meta')
}
