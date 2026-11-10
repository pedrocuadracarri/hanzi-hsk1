import type { CardProgress, Streak } from '../types'

/** Copia completa del progreso, para exportar o sincronizar entre dispositivos */
export interface Snapshot {
  app: 'hanzi-hsk1'
  version: 1
  exportedAt: string
  progress: CardProgress[]
  streak: Streak
  /** Respuestas por día (YYYY-MM-DD → número) */
  daily: Record<string, number>
}

export function isSnapshot(x: unknown): x is Snapshot {
  const s = x as Snapshot
  return !!s && s.app === 'hanzi-hsk1' && Array.isArray(s.progress) && !!s.streak && typeof s.daily === 'object'
}

const reviews = (c: CardProgress) => c.correct + c.wrong

/** La tarjeta repasada más recientemente gana; si empatan, la que tiene más repasos */
function pickCard(a: CardProgress, b: CardProgress): CardProgress {
  const la = a.lastSeen ?? ''
  const lb = b.lastSeen ?? ''
  if (la !== lb) return la > lb ? a : b
  return reviews(a) >= reviews(b) ? a : b
}

function mergeStreak(a: Streak, b: Streak): Streak {
  const la = a.lastDay ?? ''
  const lb = b.lastDay ?? ''
  const newer = la === lb ? (a.current >= b.current ? a : b) : la > lb ? a : b
  return { ...newer, best: Math.max(a.best, b.best, newer.current) }
}

/** Fusiona dos copias sin perder lo aprendido en ninguna */
export function mergeSnapshots(a: Snapshot, b: Snapshot): Snapshot {
  const cards = new Map(a.progress.map((c) => [c.wordId, c]))
  for (const c of b.progress) {
    const prev = cards.get(c.wordId)
    cards.set(c.wordId, prev ? pickCard(prev, c) : c)
  }
  const daily = { ...a.daily }
  for (const [day, n] of Object.entries(b.daily)) daily[day] = Math.max(daily[day] ?? 0, n)
  return {
    app: 'hanzi-hsk1',
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: [...cards.values()],
    streak: mergeStreak(a.streak, b.streak),
    daily,
  }
}
