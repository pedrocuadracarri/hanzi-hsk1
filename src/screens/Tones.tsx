import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_WORDS } from '../data'
import { addToneMark, splitNumeric } from '../lib/pinyin'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import ProgressDots from '../components/ProgressDots'
import { useHotkeys } from '../lib/useHotkeys'
import { getToneStats, recordTone } from '../lib/toneStats'

/** Palabras de una sílaba con tono 1–4 */
const POOL = ALL_WORDS.filter((w) => [...w.hanzi].length === 1 && splitNumeric(w.pinyinNumeric).tone < 5)
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
  const [round, setRound] = useState(0)
  const words = useMemo(() => shuffle(POOL).slice(0, QUESTIONS), [round])
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  /** Tono elegido en cada pregunta respondida */
  const [answers, setAnswers] = useState<number[]>([])

  const w = words[q]
  const { base, tone } = w ? splitNumeric(w.pinyinNumeric) : { base: '', tone: 0 }

  useEffect(() => {
    if (w) {
      const t = setTimeout(() => speak(w.hanzi), 300)
      return () => clearTimeout(t)
    }
  }, [w])

  const choose = (t: number) => {
    if (picked) return
    setPicked(t)
    setAnswers([...answers, t])
    recordTone(tone, t === tone)
  }
  const next = () => {
    setPicked(null)
    setQ(q + 1)
  }
  const restart = () => {
    setRound(round + 1)
    setQ(0)
    setAnswers([])
  }

  const correct = words.map((x, i) => answers[i] === splitNumeric(x.pinyinNumeric).tone)
  const score = correct.filter(Boolean).length
  const finished = q >= QUESTIONS

  useHotkeys({
    '1': () => !finished && choose(1),
    '2': () => !finished && choose(2),
    '3': () => !finished && choose(3),
    '4': () => !finished && choose(4),
    ' ': () => !finished && w && speak(w.hanzi),
    Enter: () => (finished ? restart() : picked && next()),
  })

  return (
    <main className="screen">
      <ExerciseHeader title="Tonos" help="Escucha y elige el tono. Es lo más difícil al principio: ¡no te agobies!" />
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
            {words.map((x, i) => (
              <li key={x.id}>
                <button className="result-row" onClick={() => speak(x.hanzi)}>
                  <span className="hanzi">{x.hanzi}</span>
                  <span>{x.pinyin}</span>
                  <span className="muted">{correct[i] ? x.meaning : `elegiste ${addToneMark(splitNumeric(x.pinyinNumeric).base, answers[i])}`}</span>
                  <span>{correct[i] ? '✅' : '❌'}</span>
                </button>
              </li>
            ))}
          </ul>
          <ToneStatsCard />
          <button className="btn btn-primary" onClick={restart}>
            Otra ronda
          </button>
          <Link to="/aprender/tonos" className="btn btn-center">
            Ver la guía de tonos
          </Link>
        </div>
      ) : (
        w && (
          <>
            <ProgressDots total={QUESTIONS} current={q} results={correct} />
            <button className="listen-big" onClick={() => speak(w.hanzi)}>
              <span className="hanzi">{w.hanzi}</span>
              <small>
                {w.emoji} {w.meaning} · toca para repetir 🔊 <span className="kbd-hint">(espacio)</span>
              </small>
            </button>
            <div className="options">
              {[1, 2, 3, 4].map((t) => {
                const cls = !picked ? '' : t === tone ? 'ok' : t === picked ? 'bad' : 'dim'
                return (
                  <button key={t} className={`option ${cls}`} onClick={() => choose(t)}>
                    <span className="kbd-hint kbd-corner">{t}</span>
                    <span className="option-pinyin">{addToneMark(base, t)}</span>
                    <small className="muted">{TONE_NAMES[t]}</small>
                  </button>
                )
              })}
            </div>
            {picked && (
              <button className="btn btn-primary" onClick={next}>
                {picked === tone ? '¡Correcto! Siguiente' : `Era ${w.pinyin}. Siguiente`}
              </button>
            )}
          </>
        )
      )}
    </main>
  )
}
