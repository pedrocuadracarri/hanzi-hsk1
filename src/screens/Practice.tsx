import { Link } from 'react-router-dom'
import { EXERCISES } from '../exercises'

export default function Practice() {
  return (
    <main className="screen">
      <h1 className="title">Practicar</h1>
      <p className="muted">
        Todos los ejercicios (salvo Tonos) usan el repaso espaciado: lo que fallas vuelve antes, lo que aciertas se
        espacia.
      </p>
      <div className="exercise-list">
        {EXERCISES.map((e) => (
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
      </div>
    </main>
  )
}
