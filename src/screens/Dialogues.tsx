import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DIALOGUES } from '../data/dialogues'
import { speak, speakAll } from '../lib/speech'
import VoiceBanner from '../components/VoiceBanner'

/** Diálogos con audio: primero se escucha, luego se lee y se comprueba */
export default function Dialogues() {
  const { id } = useParams()
  const d = DIALOGUES.find((x) => x.id === id)
  const [shown, setShown] = useState<Set<number>>(new Set())
  const [pinyin, setPinyin] = useState(true)
  const [playing, setPlaying] = useState<number | null>(null)
  const [answer, setAnswer] = useState<number | null>(null)

  useEffect(() => {
    setShown(new Set())
    setAnswer(null)
    setPlaying(null)
    return () => window.speechSynthesis?.cancel()
  }, [id])

  if (!d) {
    return (
      <main className="screen">
        <Link to="/aprender" className="back">
          ← Aprender
        </Link>
        <h1 className="title">Diálogos</h1>
        <p className="muted">
          Conversaciones cortas de la vida real con las palabras del HSK 1. Escucha primero sin leer, luego lee y comprueba si
          lo entendiste.
        </p>
        <div className="exercise-list">
          {DIALOGUES.map((x) => (
            <Link key={x.id} to={`/dialogos/${x.id}`} className="exercise card">
              <span className="exercise-icon">{x.icon}</span>
              <span>
                <strong>{x.title}</strong>
                <small className="muted hanzi">{x.lines[0].zh}</small>
              </span>
            </Link>
          ))}
        </div>
      </main>
    )
  }

  const idx = DIALOGUES.indexOf(d)
  const next = DIALOGUES[idx + 1]
  const toggle = (i: number) => {
    speak(d.lines[i].zh)
    setShown((s) => new Set(s).add(i))
  }

  return (
    <main className="screen">
      <Link to="/dialogos" className="back">
        ← Diálogos
      </Link>
      <h1 className="title">
        {d.icon} {d.title}
      </h1>
      <VoiceBanner />
      <div className="rate-row">
        <button className="btn btn-primary" onClick={() => speakAll(d.lines.map((l) => l.zh), setPlaying)}>
          ▶ Escuchar todo
        </button>
        <button className="btn" onClick={() => setPinyin(!pinyin)}>
          {pinyin ? 'Ocultar pinyin' : 'Ver pinyin'}
        </button>
      </div>
      <p className="muted small-left">Toca cada frase para oírla y ver la traducción.</p>
      <div className="chat">
        {d.lines.map((l, i) => (
          <button key={i} className={`bubble bubble-${l.who} ${playing === i ? 'speaking' : ''}`} onClick={() => toggle(i)}>
            <span className="bubble-who">{l.who}</span>
            <span className="hanzi bubble-zh">{l.zh}</span>
            {pinyin && <small>{l.py}</small>}
            {shown.has(i) && <small className="muted">{l.es}</small>}
          </button>
        ))}
      </div>

      <section className="card dialogue-q">
        <strong>❓ {d.question.q}</strong>
        <div className="exercise-list">
          {d.question.options.map((o, i) => {
            const cls = answer === null ? '' : i === d.question.answer ? 'ok' : i === answer ? 'bad' : 'dim'
            return (
              <button key={o} className={`option option-row ${cls}`} onClick={() => answer === null && setAnswer(i)}>
                {o}
              </button>
            )
          })}
        </div>
        {answer !== null && (
          <p className="small-left">
            {answer === d.question.answer ? '✅ ¡Lo has entendido!' : '❌ Vuelve a escucharlo y fíjate en los detalles.'}
          </p>
        )}
      </section>

      {next ? (
        <Link to={`/dialogos/${next.id}`} className="btn btn-center">
          Siguiente: {next.icon} {next.title} →
        </Link>
      ) : (
        <Link to="/dialogos" className="btn btn-center">
          Todos los diálogos
        </Link>
      )}
    </main>
  )
}
