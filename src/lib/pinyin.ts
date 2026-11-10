const TONES: Record<string, [string, number]> = {
  ā: ['a', 1], á: ['a', 2], ǎ: ['a', 3], à: ['a', 4],
  ē: ['e', 1], é: ['e', 2], ě: ['e', 3], è: ['e', 4],
  ī: ['i', 1], í: ['i', 2], ǐ: ['i', 3], ì: ['i', 4],
  ō: ['o', 1], ó: ['o', 2], ǒ: ['o', 3], ò: ['o', 4],
  ū: ['u', 1], ú: ['u', 2], ǔ: ['u', 3], ù: ['u', 4],
  ǖ: ['ü', 1], ǘ: ['ü', 2], ǚ: ['ü', 3], ǜ: ['ü', 4],
}

const MARKS: Record<string, string> = {
  a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ',
}

/** "hao", 3 → "hǎo". Regla: a/e llevan la tilde; en «ou», la o; si no, la última vocal. */
export function addToneMark(base: string, tone: number): string {
  if (tone < 1 || tone > 4) return base
  const s = base.replace('v', 'ü')
  let idx = s.search(/[ae]/)
  if (idx < 0) idx = s.indexOf('ou')
  if (idx < 0) {
    for (let i = s.length - 1; i >= 0; i--) if (MARKS[s[i]]) { idx = i; break }
  }
  if (idx < 0) return s
  return s.slice(0, idx) + MARKS[s[idx]][tone - 1] + s.slice(idx + 1)
}

/** "ni3" → { base: "ni", tone: 3 } */
export function splitNumeric(syl: string): { base: string; tone: number } {
  const m = syl.match(/^(.*?)([1-5])$/)
  return m ? { base: m[1], tone: Number(m[2]) } : { base: syl, tone: 5 }
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
