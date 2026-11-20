import { useEffect, useRef, useState } from 'react'
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
import { EXERCISES, isLocked } from '../exercises'
import { UNITS, currentUnitIndex, unitStats, unitStatus } from '../lib/path'

/** Palabra del día: fija para cada fecha */
function wordOfDay(today: string) {
  const n = [...today].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)
  return ALL_WORDS[Math.abs(n) % ALL_WORDS.length]
}

function greeting() {
  const h = new Date().getHours()
  return h < 6 ? 'Buenas noches' : h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches'
}

/** Lecciones que conviene leer antes de practicar */
const FIRST_LESSONS = ['empieza', 'pinyin', 'tonos']

const QUICK = [
  { to: '/tarjetas', icon: '🃏', label: 'Tarjetas', ex: 'flashcards' },
  { to: '/escuchar', icon: '👂', label: 'Escuchar', ex: 'listen' },
  { to: '/pares', icon: '👯', label: 'Sonidos', ex: 'pairs' },
  { to: '/tonos', icon: '🎵', label: 'Tonos', ex: 'tones' },
  { to: '/escribir', icon: '✍️', label: 'Escribir', ex: 'write' },
  { to: '/frases', icon: '🧱', label: 'Frases', ex: 'sentences' },
  { to: '/dialogos', icon: '💬', label: 'Diálogos' },
  { to: '/examen', icon: '🏅', label: 'Simulacro', ex: 'exam' },
]

interface Step {
  to: string
  title: string
  why: string
  icon: string
}

function UnitPath({ progress }: { progress: Parameters<typeof unitStatus>[1] }) {
  const cur = currentUnitIndex(progress)
  const ref = useRef<HTMLOListElement>(null)
  useEffect(() => {
    ref.current?.querySelector('.unit-current')?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [cur])
  const unit = UNITS[cur]
  const st = unitStats(unit, progress)
  return (
    <section className="card path-card">
      <div className="path-head">
        <div>
          <small className="eyebrow">Tu ruta · unidad {cur + 1} de {UNITS.length}</small>
          <div className="unit-words">
            {unit.map((w) => (
              <Link
                key={w.id}
                to={`/palabra/${w.id}`}
                className={`unit-word hanzi ${progress[w.id] ? (isLearned(progress[w.id]) ? 'learned' : 'seen') : ''}`}
                title={w.meaning}
              >
                {w.hanzi}
              </Link>
            ))}
          </div>
        </div>
        <Link to={`/emparejar?unidad=${cur}`} className="btn btn-sm btn-primary">
          {st.seen === 0 ? 'Empezar' : st.seen < st.total ? 'Seguir' : 'Repasar'}
        </Link>
      </div>
      <ol className="unit-track" ref={ref} aria-label="Unidades">
        {UNITS.map((u, i) => {
          const s = unitStatus(i, progress)
          return (
            <li key={i} className={`unit-dot unit-${s}`} title={`Unidad ${i + 1}: ${u.map((w) => w.hanzi).join(' ')}`}>
              {s === 'learned' ? '✓' : i + 1}
            </li>
          )
        })}
      </ol>
      <p className="muted small-left">
        Una unidad = 5 palabras. Se completan (✓) cuando las aciertas varios días seguidos en el repaso.
      </p>
    </section>
  )
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
  const days = visibleStreak(streak, today)
  const wod = wordOfDay(today)
  const [tipIdx, setTipIdx] = useState(() => tipOfDay(today))
  const tip = TIPS[tipIdx]
  const read = readSet()
  const done = doneToday()
  const firstLesson = LESSONS.find((l) => FIRST_LESSONS.includes(l.id) && !read.has(l.id))
  const nextLesson = LESSONS.find((l) => !read.has(l.id))
  const cur = currentUnitIndex(progress)
  const unitLeft = UNITS[cur].some((w) => !progress[w.id])
  const unlocked = (id?: string) => {
    const ex = EXERCISES.find((e) => e.id === id)
    return !ex || !isLocked(ex, learned, settings.beginner)
  }

  // Un único «siguiente paso» recomendado
  let step: Step
  if (firstLesson && seen < 10)
    step = { to: `/aprender/${firstLesson.id}`, icon: firstLesson.icon, title: `Lee: ${firstLesson.title}`, why: '5 minutos de base antes de practicar.' }
  else if (due > 0)
    step = { to: '/repaso', icon: '🔁', title: `Repasar ${due} ${due === 1 ? 'palabra' : 'palabras'}`, why: 'Lo primero, repasar: así no se te olvida lo que ya has visto.' }
  else if (unitLeft && settings.beginner)
    step = { to: `/emparejar?unidad=${cur}`, icon: '✨', title: `Unidad ${cur + 1}: palabras nuevas`, why: UNITS[cur].map((w) => w.hanzi).join(' · ') }
  else if (unitLeft)
    step = { to: '/emparejar', icon: '✨', title: 'Aprender palabras nuevas', why: 'No tienes repasos pendientes: buen momento para avanzar.' }
  else if (!done.has('/pares'))
    step = { to: '/pares', icon: '👯', title: 'Entrenar el oído', why: 'Distingue zh/z, an/ang… lo que más cuesta al empezar.' }
  else step = { to: '/escuchar', icon: '👂', title: 'Escuchar', why: 'Refuerza lo aprendido de oído.' }

  const plan = [
    due > 0
      ? { to: '/repaso', label: `Repasar ${due} pendientes`, ok: false }
      : { to: '/repaso', label: 'Repaso mixto', ok: done.has('/repaso') },
    settings.beginner
      ? { to: `/emparejar?unidad=${cur}`, label: `Unidad ${cur + 1}: 5 palabras`, ok: done.has('/emparejar') }
      : { to: '/emparejar', label: 'Aprender 5 palabras nuevas', ok: done.has('/emparejar') },
    { to: '/escuchar', label: 'Escuchar y elegir', ok: done.has('/escuchar') },
    unlocked('sentences') && !settings.beginner
      ? { to: '/frases', label: 'Ordenar 5 frases', ok: done.has('/frases') }
      : { to: '/pares', label: 'Pares de sonidos', ok: done.has('/pares') },
    { to: '/tonos', label: 'Entrenar los tonos', ok: done.has('/tonos') },
  ]
  const planDone = plan.filter((p) => p.ok).length

  return (
    <main className="screen">
      <header className="title-row">
        <div>
          <p className="eyebrow">
            <span className="hanzi">汉字</span> HSK 1
          </p>
          <h1 className="title">{greeting()} 👋</h1>
        </div>
        <Link to="/ajustes" className="icon-btn" aria-label="Ajustes">
          ⚙️
        </Link>
      </header>

      <section className="hero">
        <div className="hero-stats">
          <div className="goal-ring" style={{ ['--pct' as string]: `${goalPct}%` }}>
            <span>
              <strong>{todayCount}</strong>
              <small>/{settings.dailyGoal}</small>
            </span>
          </div>
          <div className="hero-chips">
            <span className="hero-chip">
              🔥 <strong>{days}</strong> {days === 1 ? 'día' : 'días'}
            </span>
            <span className="hero-chip">
              ✅ <strong>{learned}</strong>/{ALL_WORDS.length} aprendidas
            </span>
            <span className="hero-chip">
              📌 <strong>{due}</strong> por repasar
            </span>
          </div>
        </div>
        {goalPct >= 100 && <p className="hero-done">🎉 ¡Objetivo de hoy cumplido!</p>}
        {loaded && (
          <Link to={step.to} className="next-step">
            <span className="next-icon" aria-hidden>
              {step.icon}
            </span>
            <span className="next-text">
              <small>Siguiente paso</small>
              <strong>{step.title}</strong>
              <span>{step.why}</span>
            </span>
            <span className="next-go" aria-hidden>
              →
            </span>
          </Link>
        )}
      </section>

      {settings.beginner && loaded && <UnitPath progress={progress} />}

      {seen > 0 && (
        <section className="card plan">
          <div className="plan-head">
            <small className="eyebrow">📋 Plan de hoy · ~15 min</small>
            <small className="muted">
              {planDone}/{plan.length}
            </small>
          </div>
          <ol className="plan-list">
            {plan.map((st) => (
              <li key={st.label} className={st.ok ? 'plan-done' : ''}>
                <Link to={st.to}>
                  <span className="plan-check" aria-hidden>
                    {st.ok ? '✓' : ''}
                  </span>
                  {st.label}
                  <span className="muted chevron">›</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {nextLesson && !firstLesson && (
        <Link to={`/aprender/${nextLesson.id}`} className="card row-link">
          <span className="row-icon">{nextLesson.icon}</span>
          <span className="row-text">
            <small className="muted">
              Guía · {read.size} de {LESSONS.length} lecciones
            </small>
            <strong>{nextLesson.title}</strong>
          </span>
          <span className="muted chevron">›</span>
        </Link>
      )}

      <section>
        <h2 className="section-title">Practicar</h2>
        <div className="quick-grid">
          {QUICK.filter((q) => unlocked(q.ex)).map((q) => (
            <Link key={q.to} to={q.to} className="quick card">
              <span>{q.icon}</span>
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      <InstallButton />

      <Link to={`/palabra/${wod.id}`} className="card wod">
        <small className="eyebrow">Palabra del día</small>
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

      <section className="card tip-card">
        <div className="tip-head">
          <small className="eyebrow">💡 Truco</small>
          <button className="link-btn" onClick={() => setTipIdx((tipIdx + 1) % TIPS.length)}>
            Otro
          </button>
        </div>
        <p>{tip.text}</p>
        {tip.to && (
          <Link to={tip.to} className="btn btn-sm tip-cta">
            {tip.cta} →
          </Link>
        )}
      </section>
    </main>
  )
}
