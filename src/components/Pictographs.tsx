import { useState, type CSSProperties, type ReactNode } from 'react'
import type { Word } from '../types'
import { PICTOS, pictosInWord, type Picto } from '../data/pictos'
import SpeakerButton from './SpeakerButton'

export function PictoSvg({ draw, className = 'picto-draw', style }: { draw: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {draw}
      </g>
    </svg>
  )
}

const clamp = (x: number) => Math.min(1, Math.max(0, x))

/** Dibujo que se transforma en el carácter: con forma intermedia, en tres etapas */
function Stage({ picto, v, onTap }: { picto: Picto; v: number; onTap: () => void }) {
  const draw = picto.old ? clamp(1 - 2 * v) : 1 - v
  const old = picto.old ? clamp(1 - Math.abs(2 * v - 1)) : 0
  const hanzi = picto.old ? clamp(2 * v - 1) : v
  return (
    <button className="picto-stage" onClick={onTap} aria-label={`Transformar el dibujo en ${picto.h}`}>
      <PictoSvg draw={picto.draw} style={{ opacity: draw }} />
      {picto.old && <PictoSvg draw={picto.old} className="picto-draw picto-old" style={{ opacity: old }} />}
      <span className="hanzi picto-hanzi" style={{ opacity: hanzi }}>
        {picto.h}
      </span>
    </button>
  )
}

function useStages(picto: Picto) {
  const [v, setV] = useState(0)
  // Toca: dibujo → (antiguo →) carácter → dibujo
  const tap = () => setV(picto.old ? (v < 0.25 ? 0.5 : v < 0.75 ? 1 : 0) : v < 0.5 ? 1 : 0)
  return { v, setV, tap }
}

function StageLabels({ picto, v }: { picto: Picto; v: number }) {
  const now = picto.old ? (v < 0.25 ? 0 : v < 0.75 ? 1 : 2) : v < 0.5 ? 0 : 2
  const labels = picto.old ? ['Dibujo', 'Antiguo', 'Hoy'] : ['Dibujo', 'Hoy']
  return (
    <div className="picto-labels" aria-hidden>
      {labels.map((l, i) => (
        <span key={l} className={(picto.old ? i : i * 2) === now ? 'on' : ''}>
          {l}
        </span>
      ))}
    </div>
  )
}

export function PictoCard({ picto }: { picto: Picto }) {
  const { v, setV, tap } = useStages(picto)
  return (
    <div className="picto card">
      <Stage picto={picto} v={v} onTap={tap} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        aria-label={`Del dibujo al carácter ${picto.h}`}
      />
      <StageLabels picto={picto} v={v} />
      <div className="picto-info">
        <strong>
          <span className="hanzi">{picto.h}</span> {picto.p}
        </strong>
        <SpeakerButton text={picto.h} />
      </div>
      <small className="muted">{picto.m}</small>
    </div>
  )
}

function PictoRow({ picto, as, word }: { picto: Picto; as: string; word: Word }) {
  const { v, tap } = useStages(picto)
  const piece = as !== picto.h
  return (
    <div className="picto-row">
      <Stage picto={picto} v={v} onTap={tap} />
      <div className="picto-row-text">
        <strong>
          <span className="hanzi">{picto.h}</span> {picto.p}
        </strong>
        <small className="muted">{picto.m}</small>
        {word.hanzi !== picto.h && (
          <small>
            En <span className="hanzi">{word.hanzi}</span> aparece {piece ? <>como <span className="hanzi">{as}</span></> : 'tal cual'}.
          </small>
        )}
        <small className="muted">Toca el dibujo para verlo cambiar.</small>
      </div>
    </div>
  )
}

/** Los pictogramas que contiene una palabra (en la ficha y al presentarla) */
export function WordPictos({ word }: { word: Word }) {
  const found = pictosInWord(word)
  if (!found.length) return null
  return (
    <section className="word-pictos">
      <small className="eyebrow">🖼️ Viene de un dibujo</small>
      {found.map(({ picto, as }) => (
        <PictoRow key={picto.h} picto={picto} as={as} word={word} />
      ))}
    </section>
  )
}

/** Galería interactiva: del dibujo al carácter (toca o desliza) */
export default function Pictographs() {
  return (
    <div className="picto-grid">
      {PICTOS.map((x) => (
        <PictoCard key={x.h} picto={x} />
      ))}
    </div>
  )
}
