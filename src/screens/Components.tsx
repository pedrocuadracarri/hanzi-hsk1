import { Link, useNavigate, useParams } from 'react-router-dom'
import { ALL_WORDS } from '../data'
import { buildComponentIndex } from '../lib/components'
import SpeakerButton from '../components/SpeakerButton'

const INDEX = buildComponentIndex(ALL_WORDS)

export default function Components() {
  const { char } = useParams()
  const navigate = useNavigate()
  const entry = char ? INDEX.find((e) => e.char === char) : undefined

  if (entry) {
    return (
      <main className="screen sheet">
        <button className="back" onClick={() => navigate(-1)} aria-label="Volver">
          ← Volver
        </button>
        <section className="sheet-head">
          <div className="sheet-hanzi hanzi">{entry.char}</div>
          <div className="sheet-meaning">{entry.meanings.join(' · ')}</div>
          <small className="muted">
            Aparece en {entry.words.length} palabra{entry.words.length > 1 ? 's' : ''}
          </small>
        </section>
        <ul className="result-list card">
          {entry.words.map((w) => (
            <li key={w.id}>
              <Link to={`/palabra/${w.id}`}>
                <span className="hanzi">{w.hanzi}</span>
                <span>{w.pinyin}</span>
                <span className="muted">{w.meaning}</span>
                <SpeakerButton text={w.hanzi} />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    )
  }

  return (
    <main className="screen">
      <h1 className="title">Componentes</h1>
      <p className="muted">
        Las piezas que forman los caracteres. Si conoces 女 (mujer), ya tienes una pista para 好, 妈 y 她.
      </p>
      <div className="word-grid">
        {INDEX.map((e) => (
          <Link key={e.char} to={`/componentes/${encodeURIComponent(e.char)}`} className="word-cell">
            <span className="hanzi">{e.char}</span>
            <small>{e.meanings[0]}</small>
            <small className="count">×{e.words.length}</small>
          </Link>
        ))}
      </div>
    </main>
  )
}
