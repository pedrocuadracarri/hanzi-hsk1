import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { markKnown } from '../lib/storage'
import type { Category } from '../types'
import { ALL_WORDS, CATEGORY_LABELS, CATEGORY_ORDER } from '../data'
import { isLearned } from '../lib/srs'
import { useProgress } from '../lib/useProgress'
import { usePinyinHint } from '../lib/pinyinHint'
import { TonedPinyin } from '../components/Toned'

/** Quita tildes y tonos para buscar sin preocuparse de ellos */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Words() {
  const { progress } = useProgress()
  const hint = usePinyinHint()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'learned'>('all')
  const [selecting, setSelecting] = useState(false)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [msg, setMsg] = useState('')
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
      <div className="segmented" role="tablist" aria-label="Filtrar">
        {(
          [
            ['all', 'Todas'],
            ['new', 'Nuevas'],
            ['learning', 'En curso'],
            ['learned', 'Aprendidas'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>
      <p className="muted small-left">
        <span className="legend seen" /> vista · <span className="legend learned" /> aprendida (caja 3+)
      </p>
      {groups.length === 0 && <p className="muted">No hay resultados.</p>}
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
              <Link to={`/tarjetas?tema=${encodeURIComponent(cat)}`} className="cat-practice">
                🃏 Practicar
              </Link>
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
                  className={`word-cell ${cls} ${sel.has(w.id) ? 'picked' : ''}`}
                  aria-pressed={selecting ? sel.has(w.id) : undefined}
                  onClick={(e) => {
                    if (!selecting) return
                    e.preventDefault()
                    toggle(w.id)
                  }}
                >
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
