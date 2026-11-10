import type { Word } from '../types'

export interface ComponentEntry {
  char: string
  /** Significados distintos con los que aparece (p. ej. 月 = luna / carne) */
  meanings: string[]
  words: Word[]
}

/** Agrupa los componentes de todas las palabras, los más frecuentes primero */
export function buildComponentIndex(words: Word[]): ComponentEntry[] {
  const map = new Map<string, ComponentEntry>()
  const freq = new Map<string, number>()
  for (const w of words) {
    for (const r of w.radicals) {
      let e = map.get(r.char)
      if (!e) map.set(r.char, (e = { char: r.char, meanings: [], words: [] }))
      if (!e.meanings.includes(r.meaning)) e.meanings.push(r.meaning)
      if (!e.words.includes(w)) e.words.push(w)
      const k = r.char + '\0' + r.meaning
      freq.set(k, (freq.get(k) ?? 0) + 1)
    }
  }
  // El significado más habitual va primero
  for (const e of map.values()) {
    e.meanings.sort((a, b) => (freq.get(e.char + '\0' + b) ?? 0) - (freq.get(e.char + '\0' + a) ?? 0))
  }
  return [...map.values()].sort((a, b) => b.words.length - a.words.length || a.char.localeCompare(b.char))
}
