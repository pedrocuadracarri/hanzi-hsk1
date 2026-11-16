import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { CardProgress } from '../types'
import { ALL_WORDS, CATEGORY_LABELS, getWord } from '../data'
import { splitNumeric } from '../lib/pinyin'
import { getAllProgress } from '../lib/storage'
import SpeakerButton from '../components/SpeakerButton'
import StrokeAnimation from '../components/StrokeAnimation'
import VoiceBanner from '../components/VoiceBanner'
import ExampleSentence from '../components/ExampleSentence'
import { TonedHanzi, TonedPinyin } from '../components/Toned'

export default function CharacterSheet() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const word = getWord(id)
  const chars = word ? [...word.hanzi] : []
  const [charIdx, setCharIdx] = useState(0)
  const [card, setCard] = useState<CardProgress | null>(null)

  useEffect(() => {
    setCharIdx(0)
    getAllProgress().then((p) => setCard(p[id] ?? null))
  }, [id])

  if (!word) {
    return (
      <main className="screen">
        <p>Palabra no encontrada.</p>
        <Link to="/palabras">Volver a la lista</Link>
      </main>
    )
  }

  return (
    <main className="screen sheet">
      <button className="back" onClick={() => navigate(-1)} aria-label="Volver">
        ← Volver
      </button>

      <section className="sheet-head">
        <div className="sheet-hanzi hanzi">
          <TonedHanzi hanzi={word.hanzi} pinyin={word.pinyin} />
        </div>
        <div className="sheet-pinyin">
          <TonedPinyin pinyin={word.pinyin} /> <SpeakerButton text={word.hanzi} size="lg" />
        </div>
        <div className="sheet-meaning">
          {word.emoji && <span aria-hidden>{word.emoji} </span>}
          {word.meaning}
        </div>
        <small className="muted">
          {word.pinyinNumeric
            .split(' ')
            .map((s) => {
              const t = splitNumeric(s).tone
              return t === 5 ? 'neutro' : `${t}.º tono`
            })
            .join(' + ')}
        </small>
        <small className="muted">
          {CATEGORY_LABELS[word.category]}
          {card ? ` · caja ${card.box}/5 · ${card.correct}✓ ${card.wrong}✗` : ' · aún no practicada'}
        </small>
      </section>
      <VoiceBanner />

      {word.needsReview && (
        <div className="banner">⚠️ La descomposición o la mnemotecnia de esta palabra están pendientes de revisión.</div>
      )}

      <section className="card">
        <h2>Mnemotecnia</h2>
        <p>{word.mnemonic}</p>
      </section>

      <section className="card">
        <h2>En una frase</h2>
        <ExampleSentence word={word} />
      </section>

      {(() => {
        const related = ALL_WORDS.filter((w) => w.id !== word.id && [...w.hanzi].some((c) => chars.includes(c)))
        return (
          related.length > 0 && (
            <section className="card">
              <h2>Familia de palabras</h2>
              <p className="muted small-left">Comparten carácter: aprende uno y tienes pistas para los demás.</p>
              <div className="chips related">
                {related.map((r) => (
                  <Link key={r.id} to={`/palabra/${r.id}`} replace className="chip">
                    <span className="hanzi">
                      {[...r.hanzi].map((c, i) => (
                        <span key={i} className={chars.includes(c) ? 'shared' : ''}>
                          {c}
                        </span>
                      ))}
                    </span>{' '}
                    <small>{r.meaning}</small>
                  </Link>
                ))}
              </div>
            </section>
          )
        )
      })()}

      <section className="card">
        <h2>Componentes</h2>
        <ul className="radicals">
          {word.radicals.map((r, i) => (
            <li key={i}>
              <Link to={`/componentes/${encodeURIComponent(r.char)}`}>
                <span className="hanzi">{r.char}</span>
                <span>{r.meaning}</span>
                <span className="muted chevron">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Orden de trazos</h2>
        {chars.length > 1 && (
          <div className="segmented">
            {chars.map((c, i) => (
              <button key={i} className={`hanzi ${i === charIdx ? 'active' : ''}`} onClick={() => setCharIdx(i)}>
                {c}
              </button>
            ))}
          </div>
        )}
        <StrokeAnimation char={chars[charIdx]} />
      </section>

      <nav className="rate-row">
        {(() => {
          const i = ALL_WORDS.findIndex((w) => w.id === word.id)
          const prev = ALL_WORDS[(i - 1 + ALL_WORDS.length) % ALL_WORDS.length]
          const next = ALL_WORDS[(i + 1) % ALL_WORDS.length]
          return (
            <>
              <Link to={`/palabra/${prev.id}`} replace className="btn btn-center">
                ← <span className="hanzi">{prev.hanzi}</span>
              </Link>
              <Link to={`/palabra/${next.id}`} replace className="btn btn-center">
                <span className="hanzi">{next.hanzi}</span> →
              </Link>
            </>
          )
        })()}
      </nav>
    </main>
  )
}
