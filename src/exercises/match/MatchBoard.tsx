import { useEffect, useMemo, useRef, useState } from 'react'
import { shuffle } from '../../lib/random'
import { speak } from '../../lib/speech'
import { getSettings } from '../../lib/settings'
import SpeakerButton from '../../components/SpeakerButton'

export interface MatchPair {
  id: string
  /** Lado izquierdo (hanzi o componente) */
  left: string
  /** Texto pequeño bajo el lado izquierdo (p. ej. pinyin de ayuda) */
  leftSub?: string
  /** Lado derecho (emoji, pinyin, significado…) */
  right: string
  /** Texto a pronunciar; si falta, no hay audio */
  speak?: string
}

interface Props {
  pairs: MatchPair[]
  rightClass?: string
  /** Se llama una vez por pareja: firstTry = acertada sin fallos */
  onMatch?: (id: string, firstTry: boolean) => void
  onFinish: (mistakes: Set<string>) => void
}

export default function MatchBoard({ pairs, rightClass = '', onMatch, onFinish }: Props) {
  const left = useMemo(() => shuffle(pairs), [pairs])
  const right = useMemo(() => shuffle(pairs), [pairs])
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [selRight, setSelRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<{ l: string; r: string } | null>(null)
  const mistakes = useRef(new Set<string>())

  useEffect(() => {
    if (!selLeft || !selRight) return
    if (selLeft === selRight) {
      const pair = pairs.find((p) => p.id === selLeft)!
      if (pair.speak && getSettings().autoplay) speak(pair.speak)
      if (navigator.vibrate) navigator.vibrate(15)
      onMatch?.(pair.id, !mistakes.current.has(pair.id))
      const next = new Set(matched).add(pair.id)
      setMatched(next)
      setSelLeft(null)
      setSelRight(null)
      if (next.size === pairs.length) setTimeout(() => onFinish(mistakes.current), 600)
    } else {
      mistakes.current.add(selLeft).add(selRight)
      if (navigator.vibrate) navigator.vibrate([40, 40, 40])
      setWrong({ l: selLeft, r: selRight })
      const t = setTimeout(() => {
        setWrong(null)
        setSelLeft(null)
        setSelRight(null)
      }, 650)
      return () => clearTimeout(t)
    }
  }, [selLeft, selRight])

  const state = (id: string, side: 'l' | 'r') => {
    if (matched.has(id)) return 'ok'
    if (wrong && wrong[side] === id) return 'bad'
    if ((side === 'l' ? selLeft : selRight) === id) return 'sel'
    return ''
  }
  const pick = (id: string, side: 'l' | 'r') => {
    if (wrong || matched.has(id)) return
    if (side === 'l') setSelLeft((s) => (s === id ? null : id))
    else setSelRight((s) => (s === id ? null : id))
  }

  return (
    <div className="board">
      <div className="col">
        {left.map((p) => (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            className={`tile tile-hanzi ${state(p.id, 'l')}`}
            onClick={() => pick(p.id, 'l')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(p.id, 'l')}
            aria-disabled={matched.has(p.id)}
          >
            <span className="tile-stack">
              <span className="hanzi">{p.left}</span>
              {p.leftSub && <small className="tile-sub">{p.leftSub}</small>}
            </span>
            {p.speak && <SpeakerButton text={p.speak} />}
          </div>
        ))}
      </div>
      <div className="col">
        {right.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`tile ${rightClass} ${state(p.id, 'r')}`}
            onClick={() => pick(p.id, 'r')}
            disabled={matched.has(p.id)}
          >
            {p.right}
          </button>
        ))}
      </div>
    </div>
  )
}
