import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UNITS, currentUnitIndex, markUnitStep, unitStats, unitSteps } from '../lib/path'
import { isLearned } from '../lib/srs'
import { useProgress } from '../lib/useProgress'
import NewWordsIntro from '../components/NewWordsIntro'
import VoiceBanner from '../components/VoiceBanner'
import SpeakerButton from '../components/SpeakerButton'
import { TonedPinyin } from '../components/Toned'

const STEPS = [
  { id: 'emparejar', icon: '🧩', title: 'Emparejar', desc: 'Une cada carácter con su significado' },
  { id: 'escuchar', icon: '👂', title: 'Escuchar', desc: 'Oye la palabra y elige cuál es' },
  { id: 'tarjetas', icon: '🃏', title: 'Tarjetas', desc: '¿Te acuerdas sin ayuda?' },
]

export default function Unit() {
  const n = Number(useParams().n)
  const { loaded, progress } = useProgress()
  const [viewing, setViewing] = useState(false)
  const [, refresh] = useState(0)
  const unit = UNITS[n]

  if (!unit) {
    return (
      <main className="screen">
        <p>Esa unidad no existe.</p>
        <Link to="/">Volver a Inicio</Link>
      </main>
    )
  }

  const done = unitSteps(n)
  const st = unitStats(unit, progress)
  const cur = currentUnitIndex(progress)
  const state = (id: string) => (!progress[id] ? 'new' : isLearned(progress[id]) ? 'learned' : 'seen')

  if (viewing) {
    return (
      <main className="screen">
        <header className="ex-header">
          <button className="back" onClick={() => setViewing(false)} aria-label="Volver a la unidad">
            ←
          </button>
          <h1 className="title-sm">Unidad {n + 1} · conocer las palabras</h1>
        </header>
        <VoiceBanner />
        <NewWordsIntro
          words={unit}
          label="Palabra"
          doneLabel="Hecho ✓"
          onDone={() => {
            markUnitStep(n, 'conocer')
            setViewing(false)
            refresh((x) => x + 1)
          }}
        />
      </main>
    )
  }

  return (
    <main className="screen">
      <header className="unit-nav">
        <Link to="/" className="back" aria-label="Volver a Inicio">
          ←
        </Link>
        <div className="unit-nav-title">
          <small className="eyebrow">Unidad</small>
          <h1 className="title">
            {n + 1} <small className="muted">de {UNITS.length}</small>
          </h1>
        </div>
        <div className="unit-arrows">
          {n > 0 ? (
            <Link to={`/unidad/${n - 1}`} className="icon-btn" aria-label="Unidad anterior">
              ‹
            </Link>
          ) : (
            <span className="icon-btn disabled">‹</span>
          )}
          {n < UNITS.length - 1 ? (
            <Link to={`/unidad/${n + 1}`} className="icon-btn" aria-label="Unidad siguiente">
              ›
            </Link>
          ) : (
            <span className="icon-btn disabled">›</span>
          )}
        </div>
      </header>

      {loaded && n > cur && (
        <p className="tip small-left">
          🚀 Te estás adelantando: tu unidad actual es la <Link to={`/unidad/${cur}`}>{cur + 1}</Link>. Puedes empezar esta igualmente.
        </p>
      )}

      <section className="card unit-progress">
        <div className="plan-head">
          <strong>
            {st.learned === st.total ? '✓ Unidad completada' : `${st.learned} de ${st.total} aprendidas`}
          </strong>
          <small className="muted">{st.seen - st.learned} en curso</small>
        </div>
        <div className="bar" aria-hidden>
          <div className="bar-fill" style={{ width: `${(st.learned / st.total) * 100}%` }} />
        </div>
        <ul className="unit-list">
          {unit.map((w) => (
            <li key={w.id} className={`unit-item ${state(w.id)}`}>
              <Link to={`/palabra/${w.id}`}>
                <span className="hanzi unit-item-hanzi">{w.hanzi}</span>
                <span className="unit-item-text">
                  <strong>
                    <TonedPinyin pinyin={w.pinyin} />
                  </strong>
                  <small className="muted">{w.meaning}</small>
                </span>
              </Link>
              <SpeakerButton text={w.hanzi} />
              <span className="unit-state" title={state(w.id)}>
                {state(w.id) === 'learned' ? '✓' : state(w.id) === 'seen' ? '…' : ''}
              </span>
            </li>
          ))}
        </ul>
        <small className="muted">✓ aprendida · … en curso. Se aprenden al acertarlas en el repaso de días distintos.</small>
      </section>

      <section className="exercise-list">
        <h2 className="section-title">Pasos · puedes repetirlos cuando quieras</h2>
        <button className="exercise card step-btn" onClick={() => setViewing(true)}>
          <span className="exercise-icon">{done.has('conocer') ? '✅' : '👀'}</span>
          <span className="exercise-text">
            <strong>1. Conocer las palabras</strong>
            <small className="muted">Una a una, con su dibujo, piezas y frase. Ve adelante y atrás.</small>
          </span>
          <span className="chevron muted">›</span>
        </button>
        {STEPS.map((s, i) => (
          <Link key={s.id} to={`/${s.id}?unidad=${n}`} className="exercise card">
            <span className="exercise-icon">{done.has(s.id) ? '✅' : s.icon}</span>
            <span className="exercise-text">
              <strong>
                {i + 2}. {s.title}
              </strong>
              <small className="muted">{s.desc}</small>
            </span>
            <span className="chevron muted">›</span>
          </Link>
        ))}
      </section>

      {n < UNITS.length - 1 && (
        <Link to={`/unidad/${n + 1}`} className="btn btn-center">
          Siguiente unidad →
        </Link>
      )}
    </main>
  )
}
