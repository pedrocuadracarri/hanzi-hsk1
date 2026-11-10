import { Link } from 'react-router-dom'
import type { Word } from '../types'

interface Props {
  words: Word[]
  results: Map<string, boolean>
  onNext: () => void
}

const CHEERS = ['¡Muy bien!', '¡Genial!', '¡Sigue así!', '加油! (¡ánimo!)', '¡Perfecto!']

export default function RoundResult({ words, results, onNext }: Props) {
  const ok = words.filter((w) => results.get(w.id)).length
  const title = ok === words.length ? CHEERS[Math.floor(Math.random() * CHEERS.length)] : '¡Ronda completada!'
  return (
    <div className="result card pop">
      <h2>{title}</h2>
      <p className="muted">
        {ok} de {words.length} a la primera. Las que fallaste volverán pronto para repasarlas.
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
