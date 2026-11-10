import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_WORDS } from '../data'
import { EXERCISES } from '../exercises'
import { getAllProgress, getStreak } from '../lib/storage'
import { countDue, isLearned } from '../lib/srs'
import { visibleStreak } from '../lib/streak'
import { toDay } from '../lib/dates'

export default function Home() {
  const [stats, setStats] = useState({ due: 0, learned: 0, streak: 0 })

  useEffect(() => {
    Promise.all([getAllProgress(), getStreak()]).then(([p, s]) => {
      const today = toDay()
      setStats({
        due: countDue(p, today),
        learned: Object.values(p).filter(isLearned).length,
        streak: visibleStreak(s, today),
      })
    })
  }, [])

  return (
    <main className="screen">
      <header>
        <h1 className="title">
          <span className="hanzi">汉字</span> HSK 1
        </h1>
        <p className="muted">Aprende los {ALL_WORDS.length} caracteres del nivel 1</p>
      </header>

      <div className="stats">
        <div className="stat card">
          <strong>🔥 {stats.streak}</strong>
          <span>días de racha</span>
        </div>
        <div className="stat card">
          <strong>{stats.due}</strong>
          <span>pendientes hoy</span>
        </div>
        <div className="stat card">
          <strong>{stats.learned}</strong>
          <span>aprendidas</span>
        </div>
      </div>

      <div className="exercise-list">
        {EXERCISES.map((e) =>
          e.available ? (
            <Link key={e.id} to={e.path} className="exercise card">
              <span className="exercise-icon">{e.icon}</span>
              <span>
                <strong>{e.title}</strong>
                <small className="muted">{e.description}</small>
              </span>
            </Link>
          ) : (
            <div key={e.id} className="exercise card disabled" aria-disabled>
              <span className="exercise-icon">{e.icon}</span>
              <span>
                <strong>{e.title}</strong>
                <small className="muted">Próximamente</small>
              </span>
            </div>
          ),
        )}
      </div>

      <Link to="/emparejar" className="btn btn-primary big-cta">
        {stats.due > 0 ? `Repasar ${stats.due} pendientes` : 'Empezar a practicar'}
      </Link>
    </main>
  )
}
