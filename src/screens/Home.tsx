import { Link } from 'react-router-dom'
import { ALL_WORDS } from '../data'
import { countDue, isLearned } from '../lib/srs'
import { visibleStreak } from '../lib/streak'
import { toDay } from '../lib/dates'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'
import SpeakerButton from '../components/SpeakerButton'
import InstallButton from '../components/InstallButton'

function guideStarted(): boolean {
  try {
    return (JSON.parse(localStorage.getItem('hanzi-guide-read') ?? '[]') as string[]).length > 0
  } catch {
    return true
  }
}

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
  const firstTime = loaded && seen === 0 && !guideStarted()

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

      <Link to={due > 0 ? '/emparejar?modo=meaning' : '/emparejar'} className="btn btn-primary big-cta">
        {due > 0 ? `Repasar ${due} pendientes` : seen === 0 ? 'Aprender mis primeras palabras' : 'Aprender palabras nuevas'}
      </Link>

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

      <Link to={`/palabra/${wod.id}`} className="card wod">
        <small className="muted">Palabra del día</small>
        <div className="wod-row">
          <span className="hanzi wod-hanzi">{wod.hanzi}</span>
          <span className="wod-text">
            <strong>{wod.pinyin}</strong>
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
