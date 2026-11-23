import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { markKnown } from '../lib/storage'
import type { Category } from '../types'
import { ALL_WORDS, CATEGORY_LABELS, CATEGORY_ORDER } from '../data'
import { isLearned } from '../lib/srs'
import { useProgress } from '../lib/useProgress'
import { usePinyinHint } from '../lib/pinyinHint'
import { TonedPinyin } from '../components/Toned'
import { speakAll } from '../lib/speech'
import SpeakerButton from '../components/SpeakerButton'

/** Quita tildes y tonos para buscar sin preocuparse de ellos */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const COUNT = '零 一 二 三 四 五 六 七 八 九 十'.split(' ')

type Filter ='all' | 'new' | 'learning' | 'learned'
const FILTER_KEY = 'hanzi-words-filter'
const FILTERS: { id: Filter; label: string; swatch?: string; empty: string }[] = [
  { id: 'all', label: 'Todas', empty: 'No hay resultados.' },
  { id: 'learning', label: 'Vistas', swatch: 'seen', empty: 'Aún no hay palabras vistas sin aprender.' },
  { id: 'learned', label: 'Aprendidas', swatch: 'learned', empty: 'Aún no has aprendido ninguna: acierta las vistas en el repaso de días distintos.' },
  { id: 'new', label: 'Sin ver', swatch: 'new', empty: '¡Ya has visto todas!' },
]

function savedFilter(): Filter {
  try {
    const f = localStorage.getItem(FILTER_KEY)
    return FILTERS.some((x) => x.id === f) ? (f as Filter) : 'all'
  } catch {
    return 'all'
  }
}

export default function Words() {
  const { progress } = useProgress()
  const hint = usePinyinHint()
  const [q, setQ] = useState('')
  const [filter, setFilterState] = useState<Filter>(savedFilter)
  const setFilter = (f: Filter) => {
    setFilterState(f)
    try {
      localStorage.setItem(FILTER_KEY, f)
    } catch {
      /* sin almacenamiento */
    }
  }
  const stateOf = (id: string): Filter => (!progress[id] ? 'new' : isLearned(progress[id]) ? 'learned' : 'learning')
  const counts = ALL_WORDS.reduce(
    (acc, w) => {
      acc[stateOf(w.id)]++
      return acc
    },
    { all: ALL_WORDS.length, new: 0, learning: 0, learned: 0 } as Record<Filter, number>,
  )
  const [selecting, setSelecting] = useState(false)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState('')
  const [counting, setCounting] = useState<string | null>(null)
  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const confirmKnown = async () => {
    await markKnown([...sel])
    setMsg(`✓ ${sel.size} palabra${sel.size === 1 ? '' : 's'} marcada${sel.size === 1 ? '' : 's'} como aprendida${sel.size === 1 ? '' : 's'}. Volverán a salir en el repaso dentro de unos días para comprobarlo.`)
    setSel(new Set())
    setSelecting(false)
  }

  const groups = useMemo(() => {
    const nq = norm(q.trim())
    const state = (id: string) => (!progress[id] ? 'new' : isLearned(progress[id]) ? 'learned' : 'learning')
    const match = ALL_WORDS.filter(
      (w) =>
        (filter === 'all' || state(w.id) === filter) &&
        (!nq ||
        w.hanzi.includes(q.trim()) ||
        norm(w.pinyin).replace(/\s/g, '').includes(nq.replace(/\s/g, '')) ||
        norm(w.meaning).includes(nq)),
    )
    return CATEGORY_ORDER.map((c) => [c, match.filter((w) => w.category === c)] as [Category, typeof match]).filter(
      ([, ws]) => ws.length,
    )
  }, [q, filter, progress])

  return (
    <main className="screen">
      <div className="title-row">
        <h1 className="title">Palabras</h1>
        <div className="row-gap">
          <button className={`btn btn-sm ${selecting ? 'btn-active' : ''}`} onClick={() => { setSelecting(!selecting); setSel(new Set()); setMsg('') }}>
            {selecting ? 'Cancelar' : '✓ Ya me sé…'}
          </button>
          <Link to="/componentes" className="btn btn-sm">
            🧱 Piezas
          </Link>
        </div>
      </div>
      {selecting && (
        <p className="tip small-left">
          Toca las palabras que ya conoces (por ejemplo, de Duolingo). Pasarán directamente a <strong>aprendidas</strong> y la app no
          te las enseñará desde cero.
        </p>
      )}
      {msg && <p className="tip small-left pop">{msg}</p>}
      <input
        className="search"
        type="search"
        placeholder="Buscar: «agua», «shui», 水…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="filter-chips" role="radiogroup" aria-label="Filtrar palabras">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="radio"
            aria-checked={filter === f.id}
            className={`filter-chip ${filter === f.id ? 'on' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.swatch && <span className={`legend ${f.swatch}`} aria-hidden />}
            {f.label}
            <span className="filter-count">{counts[f.id]}</span>
          </button>
        ))}
      </div>
      <p className="muted small-left">
        {filter === 'learning'
          ? 'Vistas: ya te las presenté, pero aún no las dominas.'
          : filter === 'learned'
            ? 'Aprendidas: las has acertado en el repaso varios días (caja 3 o más).'
            : filter === 'new'
              ? 'Sin ver: todavía no te las he presentado.'
              : 'Toca un filtro para ver solo las vistas, las aprendidas o las que te faltan.'}
      </p>
      {groups.length === 0 && <p className="muted">{q.trim() ? 'No hay resultados.' : FILTERS.find((f) => f.id === filter)!.empty}</p>}
      {groups.map(([cat, ws]) => (
        <section key={cat}>
          <h2 className="section-title cat-title">
            <span>
              {CATEGORY_LABELS[cat]} <small className="muted">{ws.length}</small>
            </span>
            {selecting ? (
              <button className="link-btn cat-practice" onClick={() => setSel((s) => new Set([...s, ...ws.map((w) => w.id)]))}>
                Seleccionar todas
              </button>
            ) : (
              <span className="row-gap">
                {cat === 'número' && (
                  <button className="link-btn cat-practice" onClick={() => speakAll(COUNT, (i) => setCounting(i === null ? null : COUNT[i]))}>
                    🔊 Escuchar 0–10
                  </button>
                )}
                <Link to={`/tarjetas?tema=${encodeURIComponent(cat)}`} className="cat-practice">
                  🃏 Practicar
                </Link>
              </span>
            )}
          </h2>
          <div className="word-grid">
            {ws.map((w) => {
              const p = progress[w.id]
              const cls = p ? (isLearned(p) ? 'learned' : 'seen') : ''
              return (
                <Link
                  key={w.id}
                  to={`/palabra/${w.id}`}
                  className={`word-cell ${cls} ${sel.has(w.id) ? 'picked' : ''} ${counting === w.hanzi ? 'speaking' : ''}`}
                  aria-pressed={selecting ? sel.has(w.id) : undefined}
                  onClick={(e) => {
                    if (!selecting) return
                    e.preventDefault()
                    toggle(w.id)
                  }}
                >
                  {!selecting && <SpeakerButton text={w.hanzi} />}
                  {w.emoji && <span className="word-emoji" aria-hidden>{w.emoji}</span>}
                  <span className="hanzi">{w.hanzi}</span>
                  <small>{hint(w.id) ? <TonedPinyin pinyin={w.pinyin} /> : ''}</small>
                  <small className="word-meaning">{w.meaning}</small>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
      {selecting && sel.size > 0 && (
        <div className="action-bar pop">
          <button className="btn btn-primary" onClick={confirmKnown}>
            Marcar {sel.size} como ya sabidas
          </button>
        </div>
      )}
    </main>
  )
}
