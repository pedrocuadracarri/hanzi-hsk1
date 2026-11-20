import { Link } from 'react-router-dom'
import { EXERCISES, isLocked } from '../exercises'
import { isLearned } from '../lib/srs'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'

export default function Practice() {
  const { progress } = useProgress()
  const { beginner } = useSettings()
  const learned = Object.values(progress).filter(isLearned).length

  return (
    <main className="screen">
      <header className="page-head">
        <h1 className="title">Practicar</h1>
        <p className="muted">Lo que fallas vuelve antes; lo que aciertas se espacia.</p>
      </header>
      {beginner && (
        <p className="tip small-left">
          🌱 <strong>Modo principiante:</strong> algunos ejercicios se abren cuando tengas base. Puedes quitarlo en{' '}
          <Link to="/ajustes">Ajustes</Link>.
        </p>
      )}
      {(
        [
          ['basico', '⭐ Reconocer y recordar'],
          ['oido', '👂 Oído y pronunciación'],
          ['uso', '✍️ Escribir, usar y ponerte a prueba'],
        ] as const
      ).map(([g, title]) => (
        <section key={g} className="exercise-list">
          <h2 className="section-title">{title}</h2>
          {EXERCISES.filter((e) => e.group === g).map((e) => {
            const locked = isLocked(e, learned, beginner)
            const inner = (
              <>
                <span className="exercise-icon" aria-hidden>
                  {locked ? '🔒' : e.icon}
                </span>
                <span className="exercise-text">
                  <strong>
                    {e.title} {e.beginner && !locked && <span className="badge">Para empezar</span>}
                  </strong>
                  <small className="muted">
                    {locked ? `Se abre con ${e.unlockAt} palabras aprendidas (llevas ${learned})` : e.description}
                  </small>
                  {locked && (
                    <span className="bar bar-thin" aria-hidden>
                      <span className="bar-fill" style={{ width: `${(learned / (e.unlockAt ?? 1)) * 100}%` }} />
                    </span>
                  )}
                </span>
                {!locked && <span className="chevron muted">›</span>}
              </>
            )
            return locked ? (
              <div key={e.id} className="exercise card disabled" aria-disabled>
                {inner}
              </div>
            ) : (
              <Link key={e.id} to={e.path} className="exercise card">
                {inner}
              </Link>
            )
          })}
        </section>
      ))}
    </main>
  )
}
