import { useEffect, useMemo, useRef, useState } from 'react'
import type { MatchMode, Word } from '../../types'
import { answerFor } from '../../lib/rounds'
import { shuffle } from '../../lib/random'
import { speak } from '../../lib/speech'
import SpeakerButton from '../../components/SpeakerButton'

interface Props {
  words: Word[]
  mode: MatchMode
  /** Se llama una vez por palabra al emparejarla: correct = acertada a la primera */
  onAnswer: (word: Word, correct: boolean) => void
  onFinish: (mistakes: Set<string>) => void
}

export default function MatchBoard({ words, mode, onAnswer, onFinish }: Props) {
  const left = useMemo(() => shuffle(words), [words])
  const right = useMemo(() => shuffle(words), [words])
  const [selLeft, setSelLeft] = useState<string | null>(null)
  const [selRight, setSelRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<{ l: string; r: string } | null>(null)
  const mistakes = useRef(new Set<string>())

  useEffect(() => {
    if (!selLeft || !selRight) return
    if (selLeft === selRight) {
      const word = words.find((w) => w.id === selLeft)!
      speak(word.hanzi)
      onAnswer(word, !mistakes.current.has(word.id))
      const next = new Set(matched).add(word.id)
      setMatched(next)
      setSelLeft(null)
      setSelRight(null)
      if (next.size === words.length) setTimeout(() => onFinish(mistakes.current), 500)
    } else {
      mistakes.current.add(selLeft).add(selRight)
      setWrong({ l: selLeft, r: selRight })
      const t = setTimeout(() => {
        setWrong(null)
        setSelLeft(null)
        setSelRight(null)
      }, 600)
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
        {left.map((w) => (
          <div
            key={w.id}
            role="button"
            tabIndex={0}
            className={`tile tile-hanzi ${state(w.id, 'l')}`}
            onClick={() => pick(w.id, 'l')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(w.id, 'l')}
            aria-disabled={matched.has(w.id)}
          >
            <span className="hanzi">{w.hanzi}</span>
            <SpeakerButton text={w.hanzi} />
          </div>
        ))}
      </div>
      <div className="col">
        {right.map((w) => (
          <button
            key={w.id}
            type="button"
            className={`tile tile-${mode} ${state(w.id, 'r')}`}
            onClick={() => pick(w.id, 'r')}
            disabled={matched.has(w.id)}
          >
            {answerFor(w, mode)}
          </button>
        ))}
      </div>
    </div>
  )
}
