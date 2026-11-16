import { Link } from 'react-router-dom'
import type { Box } from '../types'
import { ALL_WORDS, CATEGORY_LABELS, CATEGORY_ORDER, getWord } from '../data'
import { isDue, isLearned } from '../lib/srs'
import { visibleStreak } from '../lib/streak'
import { addDays, toDay } from '../lib/dates'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'

const BOXES: Box[] = [1, 2, 3, 4, 5]
const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export default function Progress() {
  const { progress, streak, daily } = useProgress()
  const { dailyGoal } = useSettings()
  const today = toDay()
  const cards = Object.values(progress)
  const learned = cards.filter(isLearned).length
  const due = cards.filter((c) => isDue(c, today))
  const total = ALL_WORDS.length
  const perBox = BOXES.map((b) => cards.filter((c) => c.box === b).length)
  const maxBox = Math.max(1, ...perBox)
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const totalAnswers = cards.reduce((a, c) => a + c.correct + c.wrong, 0)
  const accuracy = totalAnswers ? Math.round((cards.reduce((a, c) => a + c.correct, 0) / totalAnswers) * 100) : 0
  const next7 = Array.from({ length: 7 }, (_, i) => addDays(today, i))
  // Lo atrasado se acumula en «hoy»
  const forecast = next7.map((d, i) => cards.filter((c) => (i === 0 ? c.due <= d : c.due === d)).length)
  const maxForecast = Math.max(1, ...forecast)
  // Ritmo aproximado: palabras vistas entre días con actividad en las últimas dos semanas
  const activeDays = last14.filter((d) => (daily[d] ?? 0) > 0).length
  const perDay = activeDays ? cards.length / Math.max(activeDays, 1) : 0
  const daysToHsk1 = perDay > 0 ? Math.ceil((total - cards.length) / perDay) : null
  const hardest = [...cards].filter((c) => c.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 8)

  return (
    <main className="screen">
      <h1 className="title">Progreso</h1>

      <div className="stats">
        <div className="stat card">
          <strong>🔥 {visibleStreak(streak, today)}</strong>
          <span>racha (mejor {streak.best})</span>
        </div>
        <div className="stat card">
          <strong>{due.length}</strong>
          <span>pendientes hoy</span>
        </div>
        <div className="stat card">
          <strong>{accuracy}%</strong>
          <span>aciertos</span>
        </div>
      </div>

      <section className="card">
        <h2 className="section-title">
          Aprendidas: {learned} / {total} <small className="muted">· vistas: {cards.length}</small>
        </h2>
        <div className="bar" aria-hidden>
          <div className="bar-fill" style={{ width: `${(learned / total) * 100}%` }} />
        </div>
        <p className="muted small-left">Una palabra cuenta como aprendida al llegar a la caja 3 (la has acertado varios días).</p>
      </section>

      <section className="card">
        <h2 className="section-title">🗺️ Tu camino a B1</h2>
        <div className="path">
          {(
            [
              ['HSK 1', 150, learned],
              ['HSK 2', 300, 0],
              ['HSK 3 · B1', 600, 0],
            ] as const
          ).map(([lvl, n, l]) => (
            <div key={lvl} className="path-step">
              <small>{lvl}</small>
              <div className="bar bar-thin">
                <div className="bar-fill" style={{ width: `${(l / n) * 100}%` }} />
              </div>
              <small className="muted">
                {l}/{n}
              </small>
            </div>
          ))}
        </div>
        <p className="muted small-left">
          {daysToHsk1 !== null && cards.length < total
            ? `A tu ritmo (≈${Math.round(perDay)} palabras nuevas por día de estudio) verás todo el HSK 1 en unos ${daysToHsk1} días de práctica.`
            : cards.length >= total
              ? '¡Ya has visto todo el HSK 1! Lleva todas a la caja 3 y estarás listo para el HSK 2.'
              : 'Empieza hoy: con 5–10 palabras al día, el HSK 1 se completa en un mes.'}{' '}
          <Link to="/aprender/b1">Ver el plan →</Link>
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Últimos 14 días</h2>
        <div className="calendar">
          {last14.map((d) => {
            const n = daily[d] ?? 0
            const lvl = n === 0 ? 0 : n >= dailyGoal ? 3 : n >= dailyGoal / 2 ? 2 : 1
            const wd = new Date(d + 'T12:00:00').getDay()
            return (
              <div key={d} className="cal-day" title={`${d}: ${n} respuestas`}>
                <span className={`cal-cell lvl${lvl} ${d === today ? 'today' : ''}`}>{n || ''}</span>
                <small className="muted">{WEEKDAYS[wd]}</small>
              </div>
            )
          })}
        </div>
      </section>

      {cards.length > 0 && (
        <section className="card">
          <h2 className="section-title">Repasos de la próxima semana</h2>
          <div className="boxes forecast">
            {next7.map((d, i) => (
              <div key={d} className="box-col" title={`${d}: ${forecast[i]} palabras`}>
                <span className="box-count">{forecast[i]}</span>
                <div className="box-bar" style={{ height: `${(forecast[i] / maxForecast) * 100}%` }} />
                <span className="muted">{i === 0 ? 'hoy' : WEEKDAYS[new Date(d + 'T12:00:00').getDay()]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

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
        <p className="muted small-left">Caja 1: cada día · 2: al día siguiente · 3: a los 3 días · 4: a la semana · 5: a las 2 semanas. Si fallas, vuelve a la 1.</p>
      </section>

      <section className="card">
        <h2 className="section-title">Por temas</h2>
        <ul className="cat-list">
          {CATEGORY_ORDER.map((c) => {
            const ws = ALL_WORDS.filter((w) => w.category === c)
            const l = ws.filter((w) => progress[w.id] && isLearned(progress[w.id])).length
            return (
              <li key={c}>
                <span>{CATEGORY_LABELS[c]}</span>
                <span className="muted">
                  {l}/{ws.length}
                </span>
                <div className="bar bar-thin">
                  <div className="bar-fill" style={{ width: `${(l / ws.length) * 100}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      {hardest.length > 0 && (
        <section className="card">
          <h2 className="section-title">Las que más te cuestan</h2>
          <div className="chips">
            {hardest.map((c) => {
              const w = getWord(c.wordId)
              return (
                w && (
                  <Link key={c.wordId} to={`/palabra/${w.id}`} className="chip">
                    <span className="hanzi">{w.hanzi}</span> <small>{w.meaning}</small>
                  </Link>
                )
              )
            })}
          </div>
        </section>
      )}

      {due.length > 0 && (
        <Link to="/repaso" className="btn btn-primary big-cta">
          Repasar {due.length} pendientes
        </Link>
      )}

      <Link to="/ajustes" className="btn btn-center">
        ⚙️ Ajustes, sincronización y copia de seguridad
      </Link>
    </main>
  )
}
