import { useEffect, useMemo, useState } from 'react'
import type { Word } from '../types'
import { ALL_WORDS } from '../data'
import { buildRound } from '../lib/rounds'
import { buildQuiz, type QuizKind } from '../lib/quiz'
import { speak } from '../lib/speech'
import { getSettings, useSettings } from '../lib/settings'
import { useHotkeys } from '../lib/useHotkeys'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ProgressDots from '../components/ProgressDots'
import SpeakerButton from '../components/SpeakerButton'

const QUESTIONS = 8

const PROMPTS: Record<QuizKind, string> = {
  meaning: '¿Qué significa?',
  reverse: '¿Cuál es el carácter?',
  listen: '¿Qué palabra has oído?',
  pinyin: '¿Cómo se pronuncia?',
}

function Prompt({ kind, word }: { kind: QuizKind; word: Word }) {
  if (kind === 'listen') {
    return (
      <button className="listen-big" onClick={() => speak(word.hanzi)} aria-label="Escuchar otra vez">
        🔊
        <small>
          Toca para repetir <span className="kbd-hint">(espacio)</span>
        </small>
      </button>
    )
  }
  if (kind === 'reverse') {
    return (
      <div className="listen-big quiz-prompt">
        {word.emoji && <span>{word.emoji}</span>}
        <strong className="quiz-meaning">{word.meaning}</strong>
      </div>
    )
  }
  return (
    <div className="listen-big quiz-prompt">
      <span className="hanzi">{word.hanzi}</span>
    </div>
  )
}

function OptionLabel({ kind, o, reveal, hint }: { kind: QuizKind; o: Word; reveal: boolean; hint: boolean }) {
  if (kind === 'meaning') {
    return (
      <>
        <span className="option-text">{o.meaning}</span>
        {reveal && (
          <small className="muted">
            <span className="hanzi">{o.hanzi}</span> {o.pinyin}
          </small>
        )}
      </>
    )
  }
  if (kind === 'pinyin') {
    return (
      <>
        <span className="option-pinyin">{o.pinyin}</span>
        {reveal && <small className="muted">{o.meaning}</small>}
      </>
    )
  }
  return (
    <>
      <span className="hanzi">{o.hanzi}</span>
      {(hint || reveal) && <small>{o.pinyin}</small>}
      {reveal && <small className="muted">{o.meaning}</small>}
    </>
  )
}

export default function Review() {
  const settings = useSettings()
  const s = useWordSession((progress, today) =>
    buildRound({ words: ALL_WORDS, progress, mode: 'meaning', today, size: QUESTIONS }),
  )
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const questions = useMemo(() => {
    const fresh = new Set(s.newWords.map((w) => w.id))
    return buildQuiz(s.words, ALL_WORDS, (w) => fresh.has(w.id))
  }, [s.words, s.newWords])

  useEffect(() => {
    setQ(0)
    setPicked(null)
  }, [s.roundKey])

  const cur = s.stage === 'play' ? questions[q] : undefined

  useEffect(() => {
    if (cur?.kind !== 'listen') return
    const t = setTimeout(() => speak(cur.word.hanzi), 300)
    return () => clearTimeout(t)
  }, [cur])

  const next = () => {
    setPicked(null)
    if (q + 1 >= questions.length) s.finish()
    else setQ(q + 1)
  }

  const choose = (id: string) => {
    if (!cur || picked) return
    setPicked(id)
    const ok = id === cur.word.id
    s.answer(cur.word.id, ok)
    if (cur.kind !== 'listen' && getSettings().autoplay) speak(cur.word.hanzi)
    if (ok) setTimeout(next, 1000)
  }

  useHotkeys({
    ...Object.fromEntries((cur?.options ?? []).map((o, i) => [String(i + 1), () => choose(o.id)])),
    ' ': () => cur && speak(cur.word.hanzi),
    Enter: () => cur && picked && picked !== cur.word.id && next(),
  })

  let body = null
  if (s.stage === 'intro') body = <NewWordsIntro words={s.newWords} onDone={s.play} />
  else if (s.stage === 'done') body = <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  else if (cur) {
    const { word, kind, options } = cur
    const wrong = picked !== null && picked !== word.id
    body = (
      <>
        <ProgressDots total={questions.length} current={q} results={questions.map((x) => s.results.get(x.word.id))} />
        <p className="quiz-question">{PROMPTS[kind]}</p>
        <Prompt kind={kind} word={word} />
        <div className={`options ${kind === 'meaning' ? 'options-text' : ''}`}>
          {options.map((o, i) => {
            const cls = !picked ? '' : o.id === word.id ? 'ok' : o.id === picked ? 'bad' : 'dim'
            return (
              <button key={o.id} className={`option ${cls}`} onClick={() => choose(o.id)}>
                <span className="kbd-hint kbd-corner">{i + 1}</span>
                <OptionLabel kind={kind} o={o} reveal={!!picked} hint={settings.pinyinHint && kind !== 'listen'} />
              </button>
            )
          })}
        </div>
        {wrong && (
          <div className="card quiz-feedback pop">
            <div className="wod-row">
              <span className="hanzi wod-hanzi">{word.hanzi}</span>
              <span className="wod-text">
                <strong>{word.pinyin}</strong>
                <span>
                  {word.emoji} {word.meaning}
                </span>
              </span>
              <SpeakerButton text={word.hanzi} />
            </div>
            <p className="intro-mnemonic">💡 {word.mnemonic}</p>
            <button className="btn btn-primary" onClick={next} autoFocus>
              Continuar <span className="kbd-hint">(Enter)</span>
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <main className="screen">
      <ExerciseHeader title="Repaso mixto" help="Un poco de todo: significado, carácter, oído y pronunciación." />
      <VoiceBanner />
      {body}
    </main>
  )
}
