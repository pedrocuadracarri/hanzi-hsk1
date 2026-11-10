import { describe, expect, it } from 'vitest'
import { isSnapshot, mergeSnapshots, type Snapshot } from './snapshot'
import { newCard } from './srs'

const snap = (p: Partial<Snapshot>): Snapshot => ({
  app: 'hanzi-hsk1',
  version: 1,
  exportedAt: '',
  progress: [],
  streak: { current: 0, best: 0, lastDay: null },
  daily: {},
  ...p,
})

describe('mergeSnapshots', () => {
  it('gana la tarjeta repasada más recientemente', () => {
    const pc = snap({ progress: [{ ...newCard('a', '2026-01-01'), box: 4, lastSeen: '2026-01-05' }] })
    const movil = snap({ progress: [{ ...newCard('a', '2026-01-01'), box: 1, lastSeen: '2026-01-07' }] })
    expect(mergeSnapshots(pc, movil).progress[0].box).toBe(1)
    expect(mergeSnapshots(movil, pc).progress[0].box).toBe(1)
  })

  it('con la misma fecha gana la que tiene más repasos', () => {
    const a = { ...newCard('a', 'x'), lastSeen: '2026-01-05', correct: 3, box: 3 as const }
    const b = { ...newCard('a', 'x'), lastSeen: '2026-01-05', correct: 1, box: 2 as const }
    expect(mergeSnapshots(snap({ progress: [b] }), snap({ progress: [a] })).progress[0].box).toBe(3)
  })

  it('une tarjetas distintas de cada dispositivo', () => {
    const r = mergeSnapshots(
      snap({ progress: [newCard('a', 'x')] }),
      snap({ progress: [newCard('b', 'x')] }),
    )
    expect(r.progress.map((c) => c.wordId).sort()).toEqual(['a', 'b'])
  })

  it('racha: la del último día activo, mejor = máximo', () => {
    const r = mergeSnapshots(
      snap({ streak: { current: 5, best: 9, lastDay: '2026-01-03' } }),
      snap({ streak: { current: 2, best: 2, lastDay: '2026-01-06' } }),
    )
    expect(r.streak).toEqual({ current: 2, best: 9, lastDay: '2026-01-06' })
  })

  it('contador diario: máximo por día', () => {
    const r = mergeSnapshots(snap({ daily: { d1: 5, d2: 1 } }), snap({ daily: { d1: 3, d3: 4 } }))
    expect(r.daily).toEqual({ d1: 5, d2: 1, d3: 4 })
  })

  it('valida el formato', () => {
    expect(isSnapshot(snap({}))).toBe(true)
    expect(isSnapshot({ foo: 1 })).toBe(false)
  })
})
