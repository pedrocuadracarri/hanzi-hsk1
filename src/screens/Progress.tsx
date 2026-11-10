import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Box, CardProgress, Streak } from '../types'
import { ALL_WORDS, getWord } from '../data'
import { getAllProgress, getStreak, resetProgress } from '../lib/storage'
import { isDue, isLearned } from '../lib/srs'
import { EMPTY_STREAK, visibleStreak } from '../lib/streak'
import { toDay } from '../lib/dates'

const BOXES: Box[] = [1, 2, 3, 4, 5]

export default function Progress() {
  const [progress, setProgress] = useState<Record<string, CardProgress>>({})
  const [streak, setStreak] = useState<Streak>(EMPTY_STREAK)

  const load = () => {
    getAllProgress().then(setProgress)
    getStreak().then(setStreak)
  }
  useEffect(load, [])

  const today = toDay()
  const cards = Object.values(progress)
  const learned = cards.filter(isLearned).length
  const due = cards.filter((c) => isDue(c, today))
  const total = ALL_WORDS.length
  const perBox = BOXES.map((b) => cards.filter((c) => c.box === b).length)
  const maxBox = Math.max(1, ...perBox)

  const reset = async () => {
    if (!confirm('¿Borrar todo el progreso? No se puede deshacer.')) return
    await resetProgress()
    load()
  }

  return (
    <main className="screen">
      <h1 className="title">Progreso</h1>

      <div className="stats">
        <div className="stat card">
          <strong>🔥 {visibleStreak(streak, today)}</strong>
          <span>racha (mejor: {streak.best})</span>
        </div>
        <div className="stat card">
          <strong>{due.length}</strong>
          <span>pendientes hoy</span>
        </div>
        <div className="stat card">
          <strong>{cards.length}</strong>
          <span>vistas</span>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">
          Aprendidas: {learned} / {total}
        </h2>
        <div className="bar" aria-hidden>
          <div className="bar-fill" style={{ width: `${(learned / total) * 100}%` }} />
        </div>
        <p className="muted small-left">Una palabra cuenta como aprendida al llegar a la caja 3.</p>
      </section>

      <section className="card">
        <h2 className="section-title">Cajas de repaso</h2>
        <div className="boxes">
          {BOXES.map((b, i) => (
            <div key={b} className="box-col">
              <span className="box-count">{perBox[i]}</span>
              <div className="box-bar" style={{ height: `${(perBox[i] / maxBox) * 100}%` }} />
              <span className="muted">{b}</span>
            </div>
          ))}
        </div>
        <p className="muted small-left">Caja 1: cada día · 2: 1 día · 3: 3 días · 4: 1 semana · 5: 2 semanas</p>
      </section>

      {due.length > 0 && (
        <section className="card">
          <h2 className="section-title">Pendientes hoy</h2>
          <div className="chips">
            {due.map((c) => {
              const w = getWord(c.wordId)
              return (
                w && (
                  <Link key={c.wordId} to={`/palabra/${w.id}`} className="chip hanzi">
                    {w.hanzi}
                  </Link>
                )
              )
            })}
          </div>
          <Link to="/emparejar" className="btn btn-primary big-cta" style={{ marginTop: 12 }}>
            Repasar ahora
          </Link>
        </section>
      )}

      <button className="btn" onClick={reset}>
        Borrar progreso
      </button>
    </main>
  )
}
