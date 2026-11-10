const TONES: Record<string, [string, number]> = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
}

/** "nǐ hǎo" → "ni3 hao3" (tono neutro = 5) */
export function toNumeric(pinyin: string): string {
  return pinyin
    .split(/[\s']+/)
    .filter(Boolean)
    .map((syl) => {
      let tone = 5
      const base = [...syl.toLowerCase()]
        .map((c) => {
          const t = TONES[c]
          if (t) {
            tone = t[1]
            return t[0]
          }
          return c
        })
        .join('')
      return base + tone
    })
    .join(' ')
}
