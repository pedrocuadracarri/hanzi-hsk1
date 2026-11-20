import { useEffect, useMemo, useState } from 'react'
import { PICTOS, type Picto } from '../data/pictos'
import { ALL_WORDS } from '../data'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import { recordAnswer } from '../lib/storage'
import { markDoneToday } from '../lib/todayPlan'
import { useHotkeys } from '../lib/useHotkeys'
import ExerciseHeader from '../components/ExerciseHeader'
import ProgressDots from '../components/ProgressDots'
import { PictoCard, PictoSvg } from '../components/Pictographs'

const QUESTIONS = 8

interface Question {
  picto: Picto
  /** draw: ves el dibujo y eliges el carácter; hanzi: al revés */
  kind: 'draw' | 'hanzi'
  options: Picto[]
}

const WORD_ID = new Map(ALL_WORDS.map((w) => [w.hanzi, w.id]))

function buildQuestions(): Question[] {
  return shuffle(PICTOS)
    .slice(0, QUESTIONS)
    .map((picto, i) => ({
      picto,
      kind: i % 2 ? 'hanzi' : 'draw',
      options: shuffle([picto, ...shuffle(PICTOS.filter((p) => p !== picto)).slice(0, 3)]),
    }))
}

export default function Pictos() {
  const [round, setRound] = useState(0)
  const questions = useMemo(buildQuestions, [round])
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<Picto | null>(null)
  const [results, setResults] = useState<boolean[]>([])

  useEffect(() => {
    setQ(0)
    setPicked(null)
    setResults([])
  }, [questions])

  const cur = questions[q]
  const done = results.length === questions.length && !picked
  useEffect(() => {
    if (done) markDoneToday('/dibujos')
  }, [done])

  const choose = (o: Picto) => {
    if (picked) return
    const ok = o === cur.picto
    setPicked(o)
    setResults((r) => [...r, ok])
    speak(cur.picto.h)
    // Si el pictograma es también una palabra del HSK 1, cuenta para su repaso
    const id = WORD_ID.get(cur.picto.h)
    if (id) void recordAnswer(id, ok)
  }
  const next = () => {
    setPicked(null)
    if (q + 1 < questions.length) setQ(q + 1)
  }

  const playing = !!cur && !done
  useHotkeys({
    ...Object.fromEntries([0, 1, 2, 3].map((i) => [String(i + 1), () => playing && cur.options[i] && choose(cur.options[i])])),
    Enter: () => playing && picked && next(),
  })

  const score = results.filter(Boolean).length

  return (
    <main className="screen">
      <ExerciseHeader title="¿Qué dibujo es?" help="Muchos caracteres empezaron siendo dibujos. Une cada dibujo con su carácter." />
      {done ? (
        <section className="card result pop">
          <h2>
            {score >= 7 ? '🎉' : score >= 4 ? '👍' : '💪'} {score} de {questions.length}
          </h2>
          <p className="muted">Recordar el dibujo hace que el carácter se te quede mucho antes.</p>
          <button className="btn btn-primary" onClick={() => setRound(round + 1)}>
            Otra ronda
          </button>
        </section>
      ) : (
        cur && (
          <>
            <ProgressDots total={questions.length} current={q} results={questions.map((_, i) => results[i])} />
            <p className="quiz-question">{cur.kind === 'draw' ? '¿Qué carácter salió de este dibujo?' : '¿De qué dibujo viene este carácter?'}</p>
            <div className="card picto-prompt">
              {cur.kind === 'draw' ? <PictoSvg draw={cur.picto.draw} className="picto-big" /> : <span className="hanzi picto-big-hanzi">{cur.picto.h}</span>}
            </div>
            <div className="options">
              {cur.options.map((o, i) => {
                const cls = !picked ? '' : o === cur.picto ? 'ok' : o === picked ? 'bad' : 'dim'
                return (
                  <button key={o.h} className={`option ${cls}`} onClick={() => choose(o)} aria-label={cur.kind === 'draw' ? o.h : `Dibujo ${i + 1}`}>
                    <span className="kbd-hint kbd-corner">{i + 1}</span>
                    {cur.kind === 'draw' ? <span className="hanzi">{o.h}</span> : <PictoSvg draw={o.draw} className="picto-option" />}
                    {picked && <small className="muted">{o.m.split(':')[0]}</small>}
                  </button>
                )
              })}
            </div>
            {picked && (
              <div className="quiz-feedback pop">
                <strong className="center">{picked === cur.picto ? '✓ ¡Bien!' : '✗ Mira cómo cambió:'}</strong>
                <PictoCard key={cur.picto.h} picto={cur.picto} />
                <button className="btn btn-primary" onClick={next}>
                  {q + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
                </button>
              </div>
            )}
          </>
        )
      )}
    </main>
  )
}
