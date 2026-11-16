import { describe, expect, it } from 'vitest'
import { addToneMark, normalizePinyin, splitNumeric, toNumeric } from './pinyin'
import { LEVELS } from '../data'

describe('pinyin', () => {
  it('coloca la tilde según las reglas', () => {
    expect(addToneMark('hao', 3)).toBe('hǎo')
    expect(addToneMark('gou', 3)).toBe('gǒu')
    expect(addToneMark('xie', 4)).toBe('xiè')
    expect(addToneMark('liu', 4)).toBe('liù')
    expect(addToneMark('shui', 3)).toBe('shuǐ')
    expect(addToneMark('nü', 3)).toBe('nǚ')
    expect(addToneMark('ma', 5)).toBe('ma')
  })

  it('reconstruye el pinyin de todas las sílabas del HSK 1', () => {
    for (const w of LEVELS[1]) {
      const rebuilt = w.pinyinNumeric
        .split(' ')
        .map((s) => {
          const { base, tone } = splitNumeric(s)
          return addToneMark(base, tone)
        })
        .join(' ')
      expect(rebuilt, w.hanzi).toBe(w.pinyin.toLowerCase().replace("'", ' '))
    }
  })

  it('toNumeric', () => {
    expect(toNumeric('nǚ ér')).toBe('nü3 er2')
    expect(toNumeric('bà ba')).toBe('ba4 ba5')
  })
})

describe('normalizePinyin', () => {
  it('acepta tildes, números, espacios y tono neutro omitido', () => {
    expect(normalizePinyin('nǐ hǎo')).toBe('ni3hao3')
    expect(normalizePinyin('ni3 hao3')).toBe('ni3hao3')
    expect(normalizePinyin('ba4 ba')).toBe(normalizePinyin('ba4 ba5'))
    expect(normalizePinyin('nv3 er2')).toBe(normalizePinyin('nü3 er2'))
  })
})
