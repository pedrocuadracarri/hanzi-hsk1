import { useMemo, useState } from 'react'
import type { MatchMode } from '../types'
import { ALL_WORDS } from '../data'
import { answerFor, buildRound } from '../lib/rounds'
import { buildComponentIndex } from '../lib/components'
import { shuffle } from '../lib/random'
import { useSettings } from '../lib/settings'
import MatchBoard, { type MatchPair } from '../exercises/match/MatchBoard'
import { useWordSession } from '../exercises/useWordSession'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ExerciseHeader from '../components/ExerciseHeader'

type Mode = MatchMode | 'component'

const MODES: { id: Mode; label: string }[] = [
  { id: 'emoji', label: 'Emoji' },
  { id: 'meaning', label: 'Significado' },
  { id: 'pinyin', label: 'Pinyin' },
  { id: 'component', label: 'Piezas' },
]

const COMPONENTS = buildComponentIndex(ALL_WORDS).slice(0, 80)

function MatchWords({ mode }: { mode: MatchMode }) {
  const settings = useSettings()
  const s = useWordSession((progress, today) => buildRound({ words: ALL_WORDS, progress, mode, today }), [mode])

  const pairs: MatchPair[] = useMemo(
    () =>
      s.words.map((w) => ({
        id: w.id,
        left: w.hanzi,
        leftSub: mode !== 'pinyin' && settings.pinyinHint ? w.pinyin : undefined,
        right: answerFor(w, mode),
        speak: w.hanzi,
      })),
    [s.words, mode, settings.pinyinHint],
  )

  if (s.stage === 'loading') return null
  if (s.stage === 'intro') return <NewWordsIntro words={s.newWords} onDone={s.play} />
  if (s.stage === 'done') return <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  return (
    <MatchBoard
      key={s.roundKey}
      pairs={pairs}
      rightClass={`tile-${mode}`}
      onMatch={(id, ok) => s.answer(id, ok)}
      onFinish={s.finish}
    />
  )
}

function MatchComponents() {
  const [key, setKey] = useState(0)
  const [done, setDone] = useState<number | null>(null)
  const pairs: MatchPair[] = useMemo(() => {
    const seen = new Set<string>()
    return shuffle(COMPONENTS)
      .filter((c) => !seen.has(c.meanings[0]) && seen.add(c.meanings[0]))
      .slice(0, 5)
      .map((c) => ({ id: c.char, left: c.char, right: c.meanings[0] }))
  }, [key])

  if (done !== null) {
    return (
      <div className="result card pop">
        <h2>¡Ronda completada!</h2>
        <p className="muted">{5 - done} de 5 a la primera.</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setDone(null)
            setKey(key + 1)
          }}
        >
          Siguiente ronda
        </button>
      </div>
    )
  }
  return <MatchBoard key={key} pairs={pairs} rightClass="tile-meaning" onFinish={(m) => setDone(Math.min(5, m.size))} />
}

export default function Match() {
  const [mode, setMode] = useState<Mode>('emoji')
  return (
    <main className="screen">
      <ExerciseHeader title="Emparejar" help="Toca un carácter y después su pareja." />
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
      {mode === 'component' ? <MatchComponents /> : <MatchWords key={mode} mode={mode} />}
    </main>
  )
}
