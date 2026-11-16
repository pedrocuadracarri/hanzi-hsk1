import { Link } from 'react-router-dom'
import { EXERCISES } from '../exercises'

export default function Practice() {
  return (
    <main className="screen">
      <h1 className="title">Practicar</h1>
      <p className="muted">
        Casi todos los ejercicios (no Tonos ni el Simulacro) usan el repaso espaciado: lo que fallas vuelve antes, lo
        que aciertas se espacia.
      </p>
      {(
        [
          ['basico', '⭐ Reconocer y recordar'],
          ['oido', '👂 Oído y pronunciación'],
          ['uso', '✍️ Escribir, usar y ponerte a prueba'],
        ] as const
      ).map(([g, title]) => (
        <section key={g} className="exercise-list">
          <h2 className="section-title">{title}</h2>
          {EXERCISES.filter((e) => e.group === g).map((e) => (
            <Link key={e.id} to={e.path} className="exercise card">
              <span className="exercise-icon">{e.icon}</span>
              <span>
                <strong>
                  {e.title} {e.beginner && <span className="badge">Para empezar</span>}
                </strong>
                <small className="muted">{e.description}</small>
              </span>
            </Link>
          ))}
        </section>
      ))}
    </main>
  )
}
