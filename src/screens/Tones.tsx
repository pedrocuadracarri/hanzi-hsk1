import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_WORDS } from '../data'
import { addToneMark, splitNumeric } from '../lib/pinyin'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'

/** Palabras de una sílaba con tono 1–4 */
const POOL = ALL_WORDS.filter((w) => [...w.hanzi].length === 1 && splitNumeric(w.pinyinNumeric).tone < 5)
const QUESTIONS = 8
export const TONE_NAMES = ['', '1.º alto y plano', '2.º sube', '3.º baja y sube', '4.º cae fuerte']

export default function Tones() {
  const [round, setRound] = useState(0)
  const words = useMemo(() => shuffle(POOL).slice(0, QUESTIONS), [round])
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)

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
    if (t === tone) setScore(score + 1)
  }
  const next = () => {
    setPicked(null)
    setQ(q + 1)
  }

  return (
    <main className="screen">
      <ExerciseHeader title="Tonos" help="Escucha y elige el tono. Es lo más difícil al principio: ¡no te agobies!" />
      <VoiceBanner />
      {q >= QUESTIONS ? (
        <div className="result card pop">
          <h2>
            {score} / {QUESTIONS}
          </h2>
          <p className="muted">
            {score >= 6 ? '¡Tienes buen oído!' : 'Los tonos cuestan a todo el mundo. Repasa la guía de tonos y vuelve a intentarlo.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setRound(round + 1)
              setQ(0)
              setScore(0)
            }}
          >
            Otra ronda
          </button>
          <Link to="/aprender/tonos" className="btn btn-center">
            Ver la guía de tonos
          </Link>
        </div>
      ) : (
        w && (
          <>
            <p className="muted center">
              {q + 1} / {QUESTIONS}
            </p>
            <button className="listen-big" onClick={() => speak(w.hanzi)}>
              <span className="hanzi">{w.hanzi}</span>
              <small>
                {w.emoji} {w.meaning} · toca para repetir 🔊
              </small>
            </button>
            <div className="options">
              {[1, 2, 3, 4].map((t) => {
                const cls = !picked ? '' : t === tone ? 'ok' : t === picked ? 'bad' : 'dim'
                return (
                  <button key={t} className={`option ${cls}`} onClick={() => choose(t)}>
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
