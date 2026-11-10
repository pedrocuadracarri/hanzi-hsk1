import { describe, expect, it } from 'vitest'
import { buildComponentIndex } from './components'
import { LEVELS } from '../data'

describe('buildComponentIndex', () => {
  const index = buildComponentIndex(LEVELS[1])
  const get = (c: string) => index.find((e) => e.char === c)!

  it('agrupa las palabras que comparten componente', () => {
    const hanzi = get('女').words.map((w) => w.hanzi)
    expect(hanzi).toEqual(expect.arrayContaining(['好', '妈妈', '她', '女儿']))
  })

  it('no repite palabras ni significados', () => {
    for (const e of index) {
      expect(new Set(e.words).size).toBe(e.words.length)
      expect(new Set(e.meanings).size).toBe(e.meanings.length)
    }
  })

  it('ordena por frecuencia', () => {
    for (let i = 1; i < index.length; i++) {
      expect(index[i - 1].words.length).toBeGreaterThanOrEqual(index[i].words.length)
    }
  })
})
