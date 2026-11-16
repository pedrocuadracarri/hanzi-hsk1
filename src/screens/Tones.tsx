import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Word } from '../types'
import { ALL_WORDS } from '../data'
import { addToneMark, splitNumeric } from '../lib/pinyin'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import ProgressDots from '../components/ProgressDots'
import SlowButton from '../components/SlowButton'
import { useHotkeys } from '../lib/useHotkeys'
import { getToneStats, recordTone } from '../lib/toneStats'
import { markDoneToday } from '../lib/todayPlan'

const tonesOf = (w: Word) => w.pinyinNumeric.split(' ').map((s) => splitNumeric(s).tone)
const basesOf = (w: Word) => w.pinyinNumeric.split(' ').map((s) => splitNumeric(s).base)

/** Palabras de una sílaba con tono 1–4 */
const POOL1 = ALL_WORDS.filter((w) => [...w.hanzi].length === 1 && tonesOf(w)[0] < 5)
/** Dos sílabas sin tono neutro ni 3+3 (que se pronuncia 2+3 y confundiría) */
const POOL2 = ALL_WORDS.filter((w) => {
  const t = tonesOf(w)
  return t.length === 2 && t.every((x) => x < 5) && !(t[0] === 3 && t[1] === 3)
})

type Mode = 1 | 2
const same = (a: number[], b: number[]) => a.join() === b.join()

/** 4 combinaciones de tono: la correcta y otras que cambian una sola sílaba */
function comboOptions(answer: number[]): number[][] {
  if (answer.length === 1) return [[1], [2], [3], [4]]
  const cands: number[][] = []
  for (let x = 1; x <= 4; x++) {
    if (x !== answer[0]) cands.push([x, answer[1]])
    if (x !== answer[1]) cands.push([answer[0], x])
  }
  const picked = shuffle(cands.filter((c) => !(c[0] === 3 && c[1] === 3))).slice(0, 3)
  return shuffle([answer, ...picked])
}
const QUESTIONS = 8
export const TONE_NAMES = ['', '1.º alto y plano', '2.º sube', '3.º baja y sube', '4.º cae fuerte']

function ToneStatsCard() {
  const stats = getToneStats()
  const tones = ([1, 2, 3, 4] as const).filter((t) => stats[t].total > 0)
  if (!tones.length) return null
  const pct = (t: 1 | 2 | 3 | 4) => Math.round((stats[t].ok / stats[t].total) * 100)
  const worst = tones.reduce((a, b) => (pct(b) < pct(a) ? b : a))
  return (
    <div className="tip">
      <strong className="small-left">Tu oído, tono a tono (todas las rondas)</strong>
      <ul className="cat-list">
        {([1, 2, 3, 4] as const).map((t) => (
          <li key={t}>
            <span>{TONE_NAMES[t]}</span>
            <span className="muted">{stats[t].total ? `${pct(t)}%` : '—'}</span>
            <div className="bar bar-thin">
              <div className="bar-fill" style={{ width: `${stats[t].total ? pct(t) : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
      {pct(worst) < 80 && <p className="muted small-left">El que más te cuesta: el {TONE_NAMES[worst]}.</p>}
    </div>
  )
}

export default function Tones() {
  const [mode, setMode] = useState<Mode>(1)
  const [round, setRound] = useState(0)
  const questions = useMemo(
    () =>
      shuffle(mode === 1 ? POOL1 : POOL2)
        .slice(0, QUESTIONS)
        .map((w) => ({ w, answer: tonesOf(w), options: comboOptions(tonesOf(w)) })),
    [round, mode],
  )
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  /** Índice de la opción elegida en cada pregunta */
  const [answers, setAnswers] = useState<number[]>([])

  const cur = questions[q]
  const w = cur?.w

  useEffect(() => {
    if (w) {
      const t = setTimeout(() => speak(w.hanzi), 300)
      return () => clearTimeout(t)
    }
  }, [w])

  const label = (word: Word, combo: number[]) => basesOf(word).map((b, i) => addToneMark(b, combo[i])).join(' ')

  const choose = (i: number) => {
    if (picked !== null || !cur) return
    setPicked(i)
    setAnswers([...answers, i])
    if (mode === 1) recordTone(cur.answer[0], same(cur.options[i], cur.answer))
  }
  const next = () => {
    setPicked(null)
    setQ(q + 1)
  }
  const restart = () => {
    setRound(round + 1)
    setQ(0)
    setAnswers([])
    setPicked(null)
  }
  const switchMode = (m: Mode) => {
    setMode(m)
    restart()
  }

  const correct = questions.map((x, i) => answers[i] !== undefined && same(x.options[answers[i]], x.answer))
  const score = correct.filter(Boolean).length
  const finished = q >= QUESTIONS
  useEffect(() => {
    if (finished) markDoneToday('/tonos')
  }, [finished])

  useHotkeys({
    '1': () => !finished && choose(0),
    '2': () => !finished && choose(1),
    '3': () => !finished && choose(2),
    '4': () => !finished && choose(3),
    ' ': () => !finished && w && speak(w.hanzi),
    Enter: () => (finished ? restart() : picked !== null && next()),
  })

  return (
    <main className="screen">
      <ExerciseHeader title="Tonos" help="Escucha y elige el tono. Es lo más difícil al principio: ¡no te agobies!" />
      <div className="segmented" role="tablist" aria-label="Modo">
        <button role="tab" aria-selected={mode === 1} className={mode === 1 ? 'active' : ''} onClick={() => switchMode(1)}>
          1 sílaba
        </button>
        <button role="tab" aria-selected={mode === 2} className={mode === 2 ? 'active' : ''} onClick={() => switchMode(2)}>
          2 sílabas
        </button>
      </div>
      <VoiceBanner />
      {finished ? (
        <div className="result card pop">
          <h2>
            {score} / {QUESTIONS}
          </h2>
          <p className="muted">
            {score >= 6 ? '¡Tienes buen oído!' : 'Los tonos cuestan a todo el mundo. Repasa la guía de tonos y vuelve a intentarlo.'}
          </p>
          <ul className="result-list">
            {questions.map((x, i) => (
              <li key={x.w.id}>
                <button className="result-row" onClick={() => speak(x.w.hanzi)}>
                  <span className="hanzi">{x.w.hanzi}</span>
                  <span>{x.w.pinyin}</span>
                  <span className="muted">{correct[i] ? x.w.meaning : `elegiste ${label(x.w, x.options[answers[i]])}`}</span>
                  <span>{correct[i] ? '✅' : '❌'}</span>
                </button>
              </li>
            ))}
          </ul>
          {mode === 1 && <ToneStatsCard />}
          <button className="btn btn-primary" onClick={restart}>
            Otra ronda
          </button>
          <Link to="/aprender/tonos" className="btn btn-center">
            Ver la guía de tonos
          </Link>
        </div>
      ) : (
        cur &&
        w && (
          <>
            <ProgressDots total={QUESTIONS} current={q} results={correct} />
            <button className="listen-big" onClick={() => speak(w.hanzi)}>
              <span className="hanzi">{w.hanzi}</span>
              <small>
                {w.emoji} {w.meaning} · toca para repetir 🔊 <span className="kbd-hint">(espacio)</span>
              </small>
            </button>
            <SlowButton text={w.hanzi} />
            <div className="options">
              {cur.options.map((combo, i) => {
                const isAnswer = same(combo, cur.answer)
                const cls = picked === null ? '' : isAnswer ? 'ok' : i === picked ? 'bad' : 'dim'
                return (
                  <button key={combo.join()} className={`option ${cls}`} onClick={() => choose(i)}>
                    <span className="kbd-hint kbd-corner">{i + 1}</span>
                    <span className="option-pinyin">{label(w, combo)}</span>
                    <small className="muted">{combo.length === 1 ? TONE_NAMES[combo[0]] : combo.map((t) => `${t}.º`).join(' + ')}</small>
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <button className="btn btn-primary" onClick={next}>
                {same(cur.options[picked], cur.answer) ? '¡Correcto! Siguiente' : `Era ${w.pinyin}. Siguiente`}
              </button>
            )}
          </>
        )
      )}
    </main>
  )
}
