import type { Word } from '../types'

/** Fórmula visual del carácter: 好 = 女 mujer + 子 niño */
export default function Pieces({ word }: { word: Word }) {
  if (!word.radicals.length || (word.radicals.length === 1 && word.radicals[0].char === word.hanzi)) return null
  return (
    <div className="pieces" aria-label="Piezas del carácter">
      <span className="hanzi piece-main">{word.hanzi}</span>
      <span className="piece-op">=</span>
      {word.radicals.map((r, i) => (
        <span key={i} className="piece-wrap">
          {i > 0 && <span className="piece-op">+</span>}
          <span className="piece">
            <span className="hanzi">{r.char}</span>
            <small>{r.meaning}</small>
          </span>
        </span>
      ))}
    </div>
  )
}
