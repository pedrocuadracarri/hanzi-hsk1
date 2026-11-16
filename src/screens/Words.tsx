import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '../types'
import { ALL_WORDS, CATEGORY_LABELS, CATEGORY_ORDER } from '../data'
import { isLearned } from '../lib/srs'
import { useProgress } from '../lib/useProgress'
import { useSettings } from '../lib/settings'
import { TonedPinyin } from '../components/Toned'

/** Quita tildes y tonos para buscar sin preocuparse de ellos */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Words() {
  const { progress } = useProgress()
  const settings = useSettings()
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const nq = norm(q.trim())
    const match = ALL_WORDS.filter(
      (w) =>
        !nq ||
        w.hanzi.includes(q.trim()) ||
        norm(w.pinyin).replace(/\s/g, '').includes(nq.replace(/\s/g, '')) ||
        norm(w.meaning).includes(nq),
    )
    return CATEGORY_ORDER.map((c) => [c, match.filter((w) => w.category === c)] as [Category, typeof match]).filter(
      ([, ws]) => ws.length,
    )
  }, [q])

  return (
    <main className="screen">
      <div className="title-row">
        <h1 className="title">Palabras</h1>
        <Link to="/componentes" className="btn btn-sm">
          🧱 Componentes
        </Link>
      </div>
      <input
        className="search"
        type="search"
        placeholder="Buscar: «agua», «shui», 水…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <p className="muted small-left">
        <span className="legend seen" /> vista · <span className="legend learned" /> aprendida (caja 3+)
      </p>
      {groups.length === 0 && <p className="muted">No hay resultados.</p>}
      {groups.map(([cat, ws]) => (
        <section key={cat}>
          <h2 className="section-title">
            {CATEGORY_LABELS[cat]} <small className="muted">{ws.length}</small>
          </h2>
          <div className="word-grid">
            {ws.map((w) => {
              const p = progress[w.id]
              const cls = p ? (isLearned(p) ? 'learned' : 'seen') : ''
              return (
                <Link key={w.id} to={`/palabra/${w.id}`} className={`word-cell ${cls}`}>
                  {w.emoji && <span className="word-emoji" aria-hidden>{w.emoji}</span>}
                  <span className="hanzi">{w.hanzi}</span>
                  <small>{settings.pinyinHint ? <TonedPinyin pinyin={w.pinyin} /> : ''}</small>
                  <small className="word-meaning">{w.meaning}</small>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </main>
  )
}
