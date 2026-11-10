import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CardProgress } from '../types'
import { ALL_WORDS } from '../data'
import { getAllProgress } from '../lib/storage'
import { isLearned } from '../lib/srs'

export default function Words() {
  const [progress, setProgress] = useState<Record<string, CardProgress>>({})
  useEffect(() => {
    getAllProgress().then(setProgress)
  }, [])

  return (
    <main className="screen">
      <h1 className="title">Palabras</h1>
      <p className="muted">Toca una palabra para ver su ficha.</p>
      <div className="word-grid">
        {ALL_WORDS.map((w) => {
          const p = progress[w.id]
          const cls = p ? (isLearned(p) ? 'learned' : 'seen') : ''
          return (
            <Link key={w.id} to={`/palabra/${w.id}`} className={`word-cell ${cls}`}>
              <span className="hanzi">{w.hanzi}</span>
              <small>{w.pinyin}</small>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
