import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { markDoneToday } from '../lib/todayPlan'
import type { Word } from '../types'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'
import { visibleStreak } from '../lib/streak'
import { toDay } from '../lib/dates'

interface Props {
  words: Word[]
  results: Map<string, boolean>
  onNext: () => void
}

const CHEERS = ['¡Muy bien!', '¡Genial!', '¡Sigue así!', '加油! (¡ánimo!)', '¡Perfecto!']

export default function RoundResult({ words, results, onNext }: Props) {
  const { pathname } = useLocation()
  useEffect(() => markDoneToday(pathname), [pathname])
  const { daily, streak } = useProgress()
  const { dailyGoal } = useSettings()
  const today = toDay()
  const done = daily[today] ?? 0
  const goalMet = done >= dailyGoal
  const ok = words.filter((w) => results.get(w.id)).length
  const title = ok === words.length ? CHEERS[Math.floor(Math.random() * CHEERS.length)] : '¡Ronda completada!'
  return (
    <div className="result card pop">
      {goalMet && (
        <div className="confetti" aria-hidden>
          {['🎉', '✨', '🏮', '🎊', '⭐', '🧧'].map((e, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>
              {e}
            </span>
          ))}
        </div>
      )}
      <h2>{title}</h2>
      <p className="muted">
        {ok} de {words.length} a la primera. Las que fallaste volverán pronto para repasarlas.
      </p>
      <div className="bar" aria-hidden>
        <div className="bar-fill" style={{ width: `${Math.min(100, (done / dailyGoal) * 100)}%` }} />
      </div>
      <p className="small-left">
        {goalMet
          ? `🎉 ¡Objetivo de hoy cumplido! ${done} respuestas · 🔥 ${visibleStreak(streak, today)} días de racha`
          : `Objetivo de hoy: ${done}/${dailyGoal} respuestas`}
      </p>
      <ul className="result-list">
        {words.map((w) => (
          <li key={w.id}>
            <Link to={`/palabra/${w.id}`}>
              <span className="hanzi">{w.hanzi}</span>
              <span>{w.pinyin}</span>
              <span className="muted">{w.meaning}</span>
              <span>{results.get(w.id) ? '✅' : '🔁'}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={onNext}>
        Siguiente ronda
      </button>
      <Link to="/practicar" className="btn btn-center">
        Otro ejercicio
      </Link>
    </div>
  )
}
