import { describe, expect, it } from 'vitest'
import { buildQuiz, QUIZ_KEY } from './quiz'
import { seeded } from './random'
import { LEVELS } from '../data'

const pool = LEVELS[1]

describe('buildQuiz', () => {
  it('cada pregunta tiene 4 opciones distintas que incluyen la correcta', () => {
    for (let seed = 0; seed < 10; seed++) {
      const words = pool.slice(seed * 8, seed * 8 + 8)
      for (const q of buildQuiz(words, pool, () => false, seeded(seed))) {
        expect(q.options).toHaveLength(4)
        expect(q.options).toContain(q.word)
        expect(new Set(q.options.map(QUIZ_KEY[q.kind])).size).toBe(4)
      }
    }
  })

  it('mezcla los cinco tipos de pregunta', () => {
    const qs = buildQuiz(pool.slice(0, 8), pool, () => false, seeded(3))
    expect(new Set(qs.map((q) => q.kind)).size).toBe(5)
  })

  it('las palabras nuevas solo reciben preguntas visuales', () => {
    const qs = buildQuiz(pool.slice(0, 8), pool, () => true, seeded(5))
    for (const q of qs) expect(['meaning', 'reverse']).toContain(q.kind)
  })
})
