import { describe, expect, it } from 'vitest'
import type { CardProgress, Word } from '../types'
import { answerFor, buildRound, pickDistractors } from './rounds'
import { seeded } from './random'
import { newCard } from './srs'
import { LEVELS } from '../data'

const T = '2026-03-10'

const w = (id: string, extra: Partial<Word> = {}): Word => ({
  id,
  hanzi: id,
  pinyin: `p${id}`,
  pinyinNumeric: '',
  meaning: `m${id}`,
  emoji: '⭐' + id,
  radicals: [],
  mnemonic: '',
  category: 'objeto',
  level: 1,
  ...extra,
})

const words = Array.from({ length: 12 }, (_, i) => w(String(i)))

describe('pickDistractors', () => {
  it('devuelve n opciones distintas de la respuesta y entre sí', () => {
    const target = LEVELS[1].find((x) => x.hanzi === '他')!
    for (let seed = 0; seed < 20; seed++) {
      const d = pickDistractors(target, LEVELS[1], 3, (x) => x.pinyin, seeded(seed))
      expect(d).toHaveLength(3)
      const keys = [target, ...d].map((x) => x.pinyin)
      expect(new Set(keys).size).toBe(4) // nunca sale 她 (también «tā»)
    }
  })
})

describe('buildRound', () => {
  it('sin progreso devuelve 5 palabras nuevas en orden del temario', () => {
    const r = buildRound({ words, progress: {}, mode: 'meaning', today: T, rng: seeded(1) })
    expect(r.map((x) => x.id)).toEqual(['0', '1', '2', '3', '4'])
  })

  it('prioriza las pendientes de repaso, caja más baja primero', () => {
    const progress: Record<string, CardProgress> = {
      '7': { ...newCard('7', T), box: 3, due: '2026-03-01' },
      '8': { ...newCard('8', T), box: 1, due: T },
      '9': { ...newCard('9', T), box: 2, due: '2026-03-20' }, // no pendiente
    }
    const r = buildRound({ words, progress, mode: 'meaning', today: T, rng: seeded(1) })
    expect(r.map((x) => x.id)).toEqual(['8', '7', '0', '1', '2'])
  })

  it('si hay muchas pendientes no mete palabras nuevas', () => {
    const progress = Object.fromEntries(
      words.slice(5).map((x) => [x.id, newCard(x.id, T)]),
    )
    const r = buildRound({ words, progress, mode: 'meaning', today: T, rng: seeded(2) })
    expect(r).toHaveLength(5)
    expect(r.every((x) => progress[x.id])).toBe(true)
  })

  it('rellena con palabras vistas cuando no hay pendientes ni nuevas', () => {
    const progress = Object.fromEntries(
      words.map((x) => [x.id, { ...newCard(x.id, T), box: 3 as const, due: '2026-04-01' }]),
    )
    const r = buildRound({ words, progress, mode: 'meaning', today: T, rng: seeded(3) })
    expect(r).toHaveLength(5)
    expect(new Set(r.map((x) => x.id)).size).toBe(5)
  })

  it('en modo emoji solo usa palabras con emoji', () => {
    const mixed = [w('a', { emoji: null }), w('b'), w('c', { emoji: null }), w('d')]
    const r = buildRound({ words: mixed, progress: {}, mode: 'emoji', today: T })
    expect(r.map((x) => x.id)).toEqual(['b', 'd'])
  })

  it('no repite respuestas (他/她 en modo pinyin)', () => {
    const r = buildRound({ words: LEVELS[1], progress: {}, mode: 'pinyin', today: T, size: 150 })
    const answers = r.map((x) => answerFor(x, 'pinyin'))
    expect(new Set(answers).size).toBe(answers.length)
    expect(r.some((x) => x.hanzi === '他') && r.some((x) => x.hanzi === '她')).toBe(false)
  })

  it('con datos reales siempre hay ronda completa en los 3 modos', () => {
    for (const mode of ['emoji', 'pinyin', 'meaning'] as const) {
      expect(buildRound({ words: LEVELS[1], progress: {}, mode, today: T })).toHaveLength(5)
    }
  })
})
