import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { shuffle } from '../lib/random'
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
import { getExample, sentenceText } from '../data/examples'

const QUESTIONS = 8
const EXAM_QUESTIONS = 20
/** El HSK aprueba con un 60 % */
const PASS = 0.6

const PROMPTS: Record<QuizKind, string> = {
  meaning: '¿Qué significa?',
  reverse: '¿Cuál es el carácter?',
  listen: '¿Qué palabra has oído?',
  pinyin: '¿Cómo se pronuncia?',
  sentence: '¿Qué significa la frase?',
}

/** Lo que se oye en cada pregunta: la palabra, o la frase entera */
const audioFor = (kind: QuizKind, word: Word) => {
  const ex = kind === 'sentence' ? getExample(word.id) : undefined
  return ex ? sentenceText(ex) : word.hanzi
}

function Prompt({ kind, word }: { kind: QuizKind; word: Word }) {
  if (kind === 'sentence') {
    const ex = getExample(word.id)
    return (
      <button className="listen-big quiz-sentence" onClick={() => speak(audioFor(kind, word))} aria-label="Escuchar otra vez">
        <span className="hanzi">{ex ? sentenceText(ex) : word.hanzi}</span>
        <small>
          Toca para escucharla 🔊 <span className="kbd-hint">(espacio)</span>
        </small>
      </button>
    )
  }
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
  if (kind === 'sentence') {
    const ex = getExample(o.id)
    return (
      <>
        <span className="option-text">{ex?.es ?? o.meaning}</span>
        {reveal && ex && <small className="muted">{ex.py}</small>}
      </>
    )
  }
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
  // Simulacro: 20 palabras al azar de todo el HSK 1, sin presentación ni efecto en el repaso
  const exam = useLocation().pathname === '/examen'
  const s = useWordSession(
    (progress, today) =>
      exam
        ? shuffle(ALL_WORDS).slice(0, EXAM_QUESTIONS)
        : buildRound({ words: ALL_WORDS, progress, mode: 'meaning', today, size: QUESTIONS }),
    [exam],
    { intro: !exam, record: !exam },
  )
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  const questions = useMemo(() => {
    const fresh = new Set(s.newWords.map((w) => w.id))
    return buildQuiz(s.words, ALL_WORDS, (w) => !exam && fresh.has(w.id))
  }, [s.words, s.newWords, exam])

  useEffect(() => {
    setQ(0)
    setPicked(null)
  }, [s.roundKey])

  const cur = s.stage === 'play' ? questions[q] : undefined

  useEffect(() => {
    if (cur?.kind !== 'listen' && cur?.kind !== 'sentence') return
    const t = setTimeout(() => speak(audioFor(cur.kind, cur.word)), 300)
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
    if (cur.kind !== 'listen' && cur.kind !== 'sentence' && getSettings().autoplay) speak(cur.word.hanzi)
    if (ok) setTimeout(next, 1000)
  }

  useHotkeys({
    ...Object.fromEntries((cur?.options ?? []).map((o, i) => [String(i + 1), () => choose(o.id)])),
    ' ': () => cur && speak(audioFor(cur.kind, cur.word)),
    Enter: () => cur && picked && picked !== cur.word.id && next(),
  })

  let body = null
  if (s.stage === 'intro') body = <NewWordsIntro words={s.newWords} onDone={s.play} />
  else if (s.stage === 'done' && exam) {
    const ok = s.words.filter((w) => s.results.get(w.id)).length
    const pct = Math.round((ok / s.words.length) * 100)
    const failed = s.words.filter((w) => !s.results.get(w.id))
    body = (
      <div className="result card pop">
        <h2>
          {pct}% · {ok} de {s.words.length}
        </h2>
        <div className="bar" aria-hidden>
          <div className="bar-fill" style={{ width: `${pct}%`, background: pct >= PASS * 100 ? 'var(--ok)' : 'var(--accent)' }} />
        </div>
        <p>
          {pct >= 90
            ? '🏆 ¡Excelente! Estás listo para el HSK 1. Empieza a mirar el HSK 2.'
            : pct >= PASS * 100
              ? '✅ Aprobarías el HSK 1 (hace falta un 60 %). ¡Sigue repasando para asegurarlo!'
              : '📚 Aún no aprobarías (hace falta un 60 %). Es normal: sigue con el plan diario y repite el simulacro en unas semanas.'}
        </p>
        {failed.length > 0 && (
          <>
            <strong className="small-left">Para repasar:</strong>
            <div className="chips">
              {failed.map((w) => (
                <Link key={w.id} to={`/palabra/${w.id}`} className="chip">
                  <span className="hanzi">{w.hanzi}</span> <small>{w.meaning}</small>
                </Link>
              ))}
            </div>
          </>
        )}
        <button className="btn btn-primary" onClick={s.restart}>
          Otro simulacro
        </button>
        <Link to="/practicar" className="btn btn-center">
          Otro ejercicio
        </Link>
      </div>
    )
  } else if (s.stage === 'done') body = <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  else if (cur) {
    const { word, kind, options } = cur
    const wrong = picked !== null && picked !== word.id
    body = (
      <>
        <ProgressDots total={questions.length} current={q} results={questions.map((x) => s.results.get(x.word.id))} />
        <p className="quiz-question">{PROMPTS[kind]}</p>
        <Prompt kind={kind} word={word} />
        <div className={`options ${kind === 'meaning' || kind === 'sentence' ? 'options-text' : ''}`}>
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
      <ExerciseHeader
        title={exam ? 'Simulacro HSK 1' : 'Repaso mixto'}
        help={
          exam
            ? '20 preguntas al azar de las 150 palabras. No cuenta para el repaso: es para medir tu nivel.'
            : 'Un poco de todo: significado, carácter, oído, pronunciación y frases.'
        }
      />
      <VoiceBanner />
      {body}
    </main>
  )
}
