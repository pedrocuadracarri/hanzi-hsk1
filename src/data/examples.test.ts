import { describe, expect, it } from 'vitest'
import { ALL_WORDS } from '.'
import { getExample, sentenceText, sentenceTokens } from './examples'

describe('frases de ejemplo', () => {
  it('cada palabra tiene una frase que la contiene', () => {
    for (const w of ALL_WORDS) {
      const e = getExample(w.id)
      expect(e, w.id).toBeDefined()
      expect(sentenceText(e!), w.id).toContain(w.hanzi)
      expect(e!.py.length).toBeGreaterThan(0)
      expect(e!.es.length).toBeGreaterThan(0)
    }
  })

  it('las frases se pueden ordenar (al menos 2 palabras)', () => {
    for (const w of ALL_WORDS) expect(sentenceTokens(getExample(w.id)!).length, w.id).toBeGreaterThanOrEqual(2)
  })
})
