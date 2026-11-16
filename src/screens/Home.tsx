import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TIPS, tipOfDay } from '../data/tips'
import { doneToday } from '../lib/todayPlan'
import { ALL_WORDS } from '../data'
import { countDue, isLearned } from '../lib/srs'
import { visibleStreak } from '../lib/streak'
import { toDay } from '../lib/dates'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'
import SpeakerButton from '../components/SpeakerButton'
import { TonedPinyin } from '../components/Toned'
import InstallButton from '../components/InstallButton'
import { readSet } from '../lib/guideProgress'
import { LESSONS } from '../data/guide'


/** Palabra del día: fija para cada fecha */
function wordOfDay(today: string) {
  const n = [...today].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)
  return ALL_WORDS[Math.abs(n) % ALL_WORDS.length]
}

export default function Home() {
  const { loaded, progress, streak, daily } = useProgress()
  const settings = useSettings()
  const today = toDay()
  const due = countDue(progress, today)
  const learned = Object.values(progress).filter(isLearned).length
  const seen = Object.keys(progress).length
  const todayCount = daily[today] ?? 0
  const goalPct = Math.min(100, (todayCount / settings.dailyGoal) * 100)
  const wod = wordOfDay(today)
  const [tipIdx, setTipIdx] = useState(() => tipOfDay(today))
  const tip = TIPS[tipIdx]
  const read = readSet()
  const firstTime = loaded && seen === 0 && read.size === 0
  const nextLesson = read.size > 0 ? LESSONS.find((l) => !read.has(l.id)) : undefined

  return (
    <main className="screen">
      <header className="title-row">
        <div>
          <h1 className="title">
            <span className="hanzi">汉字</span> HSK 1
          </h1>
          <p className="muted">
            {learned} de {ALL_WORDS.length} palabras aprendidas
          </p>
        </div>
        <Link to="/ajustes" className="icon-btn" aria-label="Ajustes">
          ⚙️
        </Link>
      </header>

      {firstTime && (
        <Link to="/aprender/empieza" className="welcome card pop">
          <strong>👋 ¡Bienvenido! ¿Empiezas de cero?</strong>
          <span>Lee primero la guía de 5 minutos: cómo funciona el chino, el pinyin y los tonos. →</span>
        </Link>
      )}

      {nextLesson && (
        <Link to={`/aprender/${nextLesson.id}`} className="card wod">
          <small className="muted">
            Guía · {read.size} de {LESSONS.length} lecciones
          </small>
          <strong>
            {nextLesson.icon} Sigue con: {nextLesson.title} →
          </strong>
        </Link>
      )}

      <section className="card goal">
        <div className="goal-ring" style={{ ['--pct' as string]: `${goalPct}%` }}>
          <span>
            {todayCount}/{settings.dailyGoal}
          </span>
        </div>
        <div className="goal-text">
          <strong>{goalPct >= 100 ? '🎉 ¡Objetivo de hoy cumplido!' : 'Objetivo de hoy'}</strong>
          <span className="muted">
            🔥 {visibleStreak(streak, today)} {visibleStreak(streak, today) === 1 ? 'día' : 'días'} de racha
          </span>
          <span className="muted">📌 {due} pendientes de repaso</span>
        </div>
      </section>

      <Link to={due > 0 ? '/repaso' : '/emparejar'} className="btn btn-primary big-cta">
        {due > 0 ? `Repasar ${due} pendientes` : seen === 0 ? 'Aprender mis primeras palabras' : 'Aprender palabras nuevas'}
      </Link>

      {seen > 0 && (
        <section className="card plan">
          <small className="muted">📋 Plan de hoy (~15 min)</small>
          {(() => {
            const done = doneToday()
            const steps = [
              due > 0
                ? { to: '/repaso', label: `Repasar ${due} pendientes`, ok: false }
                : { to: '/repaso', label: 'Repaso mixto', ok: done.has('/repaso') },
              { to: '/emparejar', label: 'Aprender 5 palabras nuevas', ok: done.has('/emparejar') },
              { to: '/frases', label: 'Ordenar 5 frases', ok: done.has('/frases') },
              { to: '/tonos', label: 'Entrenar el oído con tonos', ok: done.has('/tonos') },
            ]
            return (
              <ol className="plan-list">
                {steps.map((st) => (
                  <li key={st.to} className={st.ok ? 'plan-done' : ''}>
                    <Link to={st.to}>
                      <span className="plan-check">{st.ok ? '✅' : '⬜'}</span>
                      {st.label}
                      <span className="muted chevron">›</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )
          })()}
        </section>
      )}

      <div className="quick-grid">
        <Link to="/tarjetas" className="quick card">
          <span>🃏</span>Tarjetas
        </Link>
        <Link to="/escuchar" className="quick card">
          <span>👂</span>Escuchar
        </Link>
        <Link to="/escribir" className="quick card">
          <span>✍️</span>Escribir
        </Link>
        <Link to="/tonos" className="quick card">
          <span>🎵</span>Tonos
        </Link>
      </div>

      <InstallButton />

      <section className="card tip-card">
        <div className="tip-head">
          <small className="muted">💡 Truco</small>
          <button className="link-btn" onClick={() => setTipIdx((tipIdx + 1) % TIPS.length)}>
            Otro truco
          </button>
        </div>
        <p>{tip.text}</p>
        {tip.to && (
          <Link to={tip.to} className="btn btn-sm tip-cta">
            {tip.cta} →
          </Link>
        )}
      </section>

      <Link to={`/palabra/${wod.id}`} className="card wod">
        <small className="muted">Palabra del día</small>
        <div className="wod-row">
          <span className="hanzi wod-hanzi">{wod.hanzi}</span>
          <span className="wod-text">
            <strong>
              <TonedPinyin pinyin={wod.pinyin} />
            </strong>
            <span>
              {wod.emoji} {wod.meaning}
            </span>
          </span>
          <SpeakerButton text={wod.hanzi} />
        </div>
      </Link>
    </main>
  )
}
