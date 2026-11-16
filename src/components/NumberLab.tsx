import { useEffect, useMemo, useState } from 'react'
import { dateToHanzi, numberPinyin, numberToHanzi, timeToHanzi } from '../lib/numbers'
import { shuffle } from '../lib/random'
import SpeakerButton from './SpeakerButton'

function explain(n: number): string {
  if (n <= 10) return 'Número básico: apréndelo de memoria.'
  const t = Math.floor(n / 10)
  const u = n % 10
  if (t === 1) return `十 (10) + ${numberToHanzi(u)} (${u}) = ${n}`
  return `${numberToHanzi(t)} (${t}) × 十 (10)${u ? ` + ${numberToHanzi(u)} (${u})` : ''} = ${n}`
}

/** Explorador de números 0–99 */
export function NumberSlider() {
  const [n, setN] = useState(23)
  const h = numberToHanzi(n)
  return (
    <div className="card number-lab">
      <div className="number-big">
        <span className="number-digits">{n}</span>
        <span className="hanzi number-hanzi">{h}</span>
      </div>
      <div className="number-py">
        {numberPinyin(h)} <SpeakerButton text={h} />
      </div>
      <small className="muted">{explain(n)}</small>
      <input type="range" min={0} max={99} value={n} onChange={(e) => setN(Number(e.target.value))} aria-label="Número" />
    </div>
  )
}

/** Mini test: ¿qué número es? */
export function NumberQuiz() {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const { target, options } = useMemo(() => {
    const target = Math.floor(Math.random() * 100)
    const set = new Set([target])
    // Distractores parecidos: mismas cifras al revés, ±10, ±1
    for (const d of [Number(String(target).padStart(2, '0').split('').reverse().join('')), target + 10, target - 1, target + 1, target - 10])
      if (set.size < 4 && d >= 0 && d <= 99) set.add(d)
    while (set.size < 4) set.add(Math.floor(Math.random() * 100))
    return { target, options: shuffle([...set]) }
  }, [round])

  useEffect(() => setPicked(null), [round])

  const choose = (o: number) => {
    if (picked !== null) return
    setPicked(o)
    if (o === target) setScore((s) => s + 1)
  }

  return (
    <div className="card number-lab">
      <small className="muted">¿Qué número es? · aciertos: {score}</small>
      <div className="number-big">
        <span className="hanzi number-hanzi">{numberToHanzi(target)}</span>
        <SpeakerButton text={numberToHanzi(target)} />
      </div>
      <div className="options">
        {options.map((o) => (
          <button
            key={o}
            className={`option ${picked === null ? '' : o === target ? 'ok' : o === picked ? 'bad' : 'dim'}`}
            onClick={() => choose(o)}
          >
            <span className="option-pinyin">{o}</span>
          </button>
        ))}
      </div>
      {picked !== null && (
        <button className="btn btn-primary" onClick={() => setRound(round + 1)}>
          Otro número
        </button>
      )}
    </div>
  )
}

/** La fecha y la hora de ahora mismo, en chino */
export function NowInChinese() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const date = dateToHanzi(now)
  const time = timeToHanzi(now)
  return (
    <div className="card number-lab">
      <small className="muted">Hoy es…</small>
      <div className="now-row">
        <span className="hanzi now-text">{date}</span>
        <SpeakerButton text={date} />
      </div>
      <small>{numberPinyin(date.replace(' ', ''))}</small>
      <small className="muted">Año (cifra a cifra) + mes + día + día de la semana. ¡Al revés que en español!</small>
      <small className="muted">Y son las…</small>
      <div className="now-row">
        <span className="hanzi now-text">{time}</span>
        <SpeakerButton text={time} />
      </div>
      <small>{numberPinyin(time)}</small>
    </div>
  )
}
