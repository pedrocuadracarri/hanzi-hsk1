import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LESSONS } from '../data/guide'
import VoiceBanner from '../components/VoiceBanner'
import { markRead, readSet } from '../lib/guideProgress'

export default function Guide() {
  const { id } = useParams()
  const idx = LESSONS.findIndex((l) => l.id === id)
  const lesson = LESSONS[idx]
  const [read, setRead] = useState(readSet)

  useEffect(() => {
    if (lesson) {
      markRead(lesson.id)
      setRead(readSet())
      window.scrollTo(0, 0)
    }
  }, [lesson])

  if (lesson) {
    const next = LESSONS[idx + 1]
    return (
      <main className="screen lesson">
        <Link to="/aprender" className="back">
          ← Guía
        </Link>
        <h1 className="title">
          {lesson.icon} {lesson.title}
        </h1>
        <VoiceBanner />
        {lesson.body()}
        {next ? (
          <Link to={`/aprender/${next.id}`} className="btn btn-primary btn-center">
            Siguiente: {next.title} →
          </Link>
        ) : (
          <Link to="/emparejar" className="btn btn-primary btn-center">
            ¡A practicar! →
          </Link>
        )}
      </main>
    )
  }

  return (
    <main className="screen">
      <h1 className="title">Aprender</h1>
      <p className="muted">Lecciones cortas para entender cómo funciona el chino. Léelas en orden la primera vez.</p>
      <div>
        <p className="muted small-left">
          {LESSONS.filter((l) => read.has(l.id)).length} de {LESSONS.length} leídas
        </p>
        <div className="bar bar-thin" aria-hidden>
          <div className="bar-fill" style={{ width: `${(LESSONS.filter((l) => read.has(l.id)).length / LESSONS.length) * 100}%` }} />
        </div>
      </div>
      <div className="exercise-list">
        {LESSONS.map((l, i) => (
          <Link key={l.id} to={`/aprender/${l.id}`} className="exercise card">
            <span className="exercise-icon">{l.icon}</span>
            <span>
              <strong>
                {i + 1}. {l.title} {read.has(l.id) && <span className="badge badge-ok">✓ Leída</span>}
              </strong>
              <small className="muted">{l.summary}</small>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
