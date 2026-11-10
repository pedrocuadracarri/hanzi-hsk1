import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { MatchMode, Word } from '../types'
import { ALL_WORDS } from '../data'
import { buildRound } from '../lib/rounds'
import { getAllProgress, recordAnswer } from '../lib/storage'
import { toDay } from '../lib/dates'
import MatchBoard from '../exercises/match/MatchBoard'
import VoiceBanner from '../components/VoiceBanner'

const MODES: { id: MatchMode; label: string }[] = [
  { id: 'emoji', label: 'Emoji' },
  { id: 'pinyin', label: 'Pinyin' },
  { id: 'meaning', label: 'Significado' },
]

export default function Match() {
  const [mode, setMode] = useState<MatchMode>('emoji')
  const [round, setRound] = useState<Word[] | null>(null)
  const [roundKey, setRoundKey] = useState(0)
  const [result, setResult] = useState<{ words: Word[]; mistakes: Set<string> } | null>(null)

  const newRound = useCallback(async (m: MatchMode) => {
    const progress = await getAllProgress()
    setResult(null)
    setRound(buildRound({ words: ALL_WORDS, progress, mode: m, today: toDay() }))
    setRoundKey((k) => k + 1)
  }, [])

  useEffect(() => {
    newRound(mode)
  }, [mode, newRound])

  return (
    <main className="screen">
      <div className="segmented" role="tablist" aria-label="Modo">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            className={mode === m.id ? 'active' : ''}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <VoiceBanner />

      {result ? (
        <div className="result card pop">
          <h2>¡Ronda completada!</h2>
          <p className="muted">
            {result.words.length - result.words.filter((w) => result.mistakes.has(w.id)).length} de{' '}
            {result.words.length} a la primera
          </p>
          <ul className="result-list">
            {result.words.map((w) => (
              <li key={w.id}>
                <Link to={`/palabra/${w.id}`}>
                  <span className="hanzi">{w.hanzi}</span>
                  <span>{w.pinyin}</span>
                  <span className="muted">{w.meaning}</span>
                  <span>{result.mistakes.has(w.id) ? '🔁' : '✅'}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary" onClick={() => newRound(mode)}>
            Siguiente ronda
          </button>
        </div>
      ) : (
        round && (
          <MatchBoard
            key={roundKey}
            words={round}
            mode={mode}
            onAnswer={(w, ok) => void recordAnswer(w.id, ok)}
            onFinish={(mistakes) => setResult({ words: round, mistakes })}
          />
        )
      )}
    </main>
  )
}
