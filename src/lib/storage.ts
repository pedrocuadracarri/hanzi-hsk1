import { openDB, type DBSchema } from 'idb'
import type { CardProgress, Streak } from '../types'
import { toDay } from './dates'
import { newCard, review } from './srs'
import { EMPTY_STREAK, touchStreak } from './streak'
import { mergeSnapshots, type Snapshot } from './snapshot'

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

/** Avisa a la interfaz (y a la sincronización) de que el progreso cambió */
export const progressEvents = new EventTarget()
const notify = () => progressEvents.dispatchEvent(new Event('change'))

export async function getAllProgress(): Promise<Record<string, CardProgress>> {
  const all = await (await dbPromise).getAll('progress')
  return Object.fromEntries(all.map((c) => [c.wordId, c]))
}

export async function getStreak(): Promise<Streak> {
  return ((await (await dbPromise).get('meta', 'streak')) as Streak | undefined) ?? EMPTY_STREAK
}

export async function getDaily(): Promise<Record<string, number>> {
  return ((await (await dbPromise).get('meta', 'daily')) as Record<string, number> | undefined) ?? {}
}

/** Guarda el resultado de una tarjeta y actualiza racha y contador diario */
export async function recordAnswer(wordId: string, correct: boolean): Promise<CardProgress> {
  const today = toDay()
  const db = await dbPromise
  const tx = db.transaction(['progress', 'meta'], 'readwrite')
  const card = (await tx.objectStore('progress').get(wordId)) ?? newCard(wordId, today)
  const updated = review(card, correct, today)
  await tx.objectStore('progress').put(updated)
  const meta = tx.objectStore('meta')
  const streak = ((await meta.get('streak')) as Streak | undefined) ?? EMPTY_STREAK
  await meta.put(touchStreak(streak, today), 'streak')
  const daily = ((await meta.get('daily')) as Record<string, number> | undefined) ?? {}
  await meta.put({ ...daily, [today]: (daily[today] ?? 0) + 1 }, 'daily')
  await tx.done
  notify()
  return updated
}

export async function exportSnapshot(): Promise<Snapshot> {
  const [progress, streak, daily] = await Promise.all([getAllProgress(), getStreak(), getDaily()])
  return {
    app: 'hanzi-hsk1',
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: Object.values(progress),
    streak,
    daily,
  }
}

/** Fusiona una copia externa con la local y guarda el resultado */
export async function importSnapshot(other: Snapshot): Promise<Snapshot> {
  const merged = mergeSnapshots(await exportSnapshot(), other)
  const db = await dbPromise
  const tx = db.transaction(['progress', 'meta'], 'readwrite')
  for (const c of merged.progress) await tx.objectStore('progress').put(c)
  await tx.objectStore('meta').put(merged.streak, 'streak')
  await tx.objectStore('meta').put(merged.daily, 'daily')
  await tx.done
  // Evento distinto: la sincronización no debe volver a dispararse por esto
  progressEvents.dispatchEvent(new Event('import'))
  return merged
}

export async function resetProgress(): Promise<void> {
  const db = await dbPromise
  await db.clear('progress')
  await db.clear('meta')
  notify()
}
