import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { MatchMode } from '../types'
import { ALL_WORDS } from '../data'
import { answerFor, buildRound } from '../lib/rounds'
import { buildComponentIndex } from '../lib/components'
import { shuffle } from '../lib/random'
import { usePinyinHint } from '../lib/pinyinHint'
import MatchBoard, { type MatchPair } from '../exercises/match/MatchBoard'
import { useWordSession } from '../exercises/useWordSession'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ExerciseHeader from '../components/ExerciseHeader'
import { useUnitParam } from '../lib/path'
import type { Word } from '../types'

type Mode = MatchMode | 'component'

const MODES: { id: Mode; label: string }[] = [
  { id: 'emoji', label: 'Emoji' },
  { id: 'meaning', label: 'Significado' },
  { id: 'pinyin', label: 'Pinyin' },
  { id: 'component', label: 'Piezas' },
]

const COMPONENTS = buildComponentIndex(ALL_WORDS).slice(0, 80)

function MatchWords({ mode, pool = ALL_WORDS }: { mode: MatchMode; pool?: Word[] }) {
  const hint = usePinyinHint()
  const s = useWordSession((progress, today) => buildRound({ words: pool, progress, mode, today }), [mode, pool])

  const pairs: MatchPair[] = useMemo(
    () =>
      s.words.map((w) => ({
        id: w.id,
        left: w.hanzi,
        leftSub: mode !== 'pinyin' && hint(w.id) ? w.pinyin : undefined,
        right: answerFor(w, mode),
        speak: w.hanzi,
      })),
    [s.words, mode, hint],
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

const MODE_KEY = 'hanzi-match-mode'
const isMode = (m: string | null): m is Mode => MODES.some((x) => x.id === m)

function savedMode(): Mode {
  try {
    const m = localStorage.getItem(MODE_KEY)
    return isMode(m) ? m : 'emoji'
  } catch {
    return 'emoji'
  }
}

export default function Match() {
  // ?modo=meaning fuerza un modo (p. ej. el repaso, que necesita todas las palabras, no solo las que tienen emoji)
  const [params] = useSearchParams()
  const forced = params.get('modo')
  // ?unidad=3: solo las palabras de esa unidad de la ruta (modo significado: todas lo tienen)
  const unit = useUnitParam()
  const [mode, setModeState] = useState<Mode>(isMode(forced) ? forced : savedMode)
  const setMode = (m: Mode) => {
    setModeState(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      /* sin almacenamiento */
    }
  }
  return (
    <main className="screen">
      <ExerciseHeader
        title={unit ? `Emparejar · unidad ${unit.index + 1}` : 'Emparejar'}
        help={unit ? 'Conoce las palabras nuevas y empareja cada carácter con su significado.' : 'Toca un carácter y después su pareja.'}
      />
      {unit ? (
        <>
          <VoiceBanner />
          <MatchWords mode="meaning" pool={unit.words} />
        </>
      ) : (
        <>
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
        </>
      )}
    </main>
  )
}
