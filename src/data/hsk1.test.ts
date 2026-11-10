import { describe, expect, it } from 'vitest'
import { LEVELS } from '.'
import { toNumeric } from '../lib/pinyin'

const words = LEVELS[1]

describe('hsk1.json', () => {
  it('tiene ~150 palabras con ids y hanzi únicos', () => {
    expect(words.length).toBeGreaterThanOrEqual(145)
    expect(new Set(words.map((w) => w.id)).size).toBe(words.length)
    expect(new Set(words.map((w) => w.hanzi)).size).toBe(words.length)
  })

  it('pinyinNumeric coincide con pinyin', () => {
    for (const w of words) expect(w.pinyinNumeric, w.hanzi).toBe(toNumeric(w.pinyin))
  })

  it('una sílaba de pinyin por carácter', () => {
    for (const w of words) expect(w.pinyinNumeric.split(' ').length, w.hanzi).toBe([...w.hanzi].length)
  })

  it('cada palabra tiene significado, mnemotecnia y radicales', () => {
    for (const w of words) {
      expect(w.meaning, w.hanzi).toBeTruthy()
      expect(w.mnemonic, w.hanzi).toBeTruthy()
      expect(w.radicals.length, w.hanzi).toBeGreaterThan(0)
    }
  })
})
