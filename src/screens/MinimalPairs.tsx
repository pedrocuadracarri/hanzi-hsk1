import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PAIR_GROUPS, type PairGroup, type PairSide } from '../data/pairs'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import { markDoneToday } from '../lib/todayPlan'
import { useHotkeys } from '../lib/useHotkeys'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import ProgressDots from '../components/ProgressDots'
import SlowButton from '../components/SlowButton'
import SpeakerButton from '../components/SpeakerButton'
import { TonedPinyin } from '../components/Toned'

const QUESTIONS = 10

interface Question {
  group: PairGroup
  options: [PairSide, PairSide]
  answer: PairSide
}

function buildQuestions(groupId: string): Question[] {
  const groups = groupId === 'all' ? PAIR_GROUPS : PAIR_GROUPS.filter((g) => g.id === groupId)
  const all = groups.flatMap((g) => g.pairs.map((p) => ({ group: g, pair: p })))
  const out: Question[] = []
  while (out.length < QUESTIONS) {
    for (const { group, pair } of shuffle(all)) {
      if (out.length >= QUESTIONS) break
      const options = shuffle([...pair]) as [PairSide, PairSide]
      out.push({ group, options, answer: pair[Math.random() < 0.5 ? 0 : 1] })
    }
  }
  return out
}

export default function MinimalPairs() {
  const [groupId, setGroupId] = useState('all')
  const [round, setRound] = useState(0)
  const questions = useMemo(() => buildQuestions(groupId), [groupId, round])
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<PairSide | null>(null)
  const [results, setResults] = useState<boolean[]>([])

  useEffect(() => {
    setQ(0)
    setPicked(null)
    setResults([])
  }, [questions])

  const cur = questions[q]
  const done = results.length === questions.length && !picked

  useEffect(() => {
    if (cur && !done) {
      const t = setTimeout(() => speak(cur.answer.hanzi), 300)
      return () => clearTimeout(t)
    }
  }, [cur, done])

  useEffect(() => {
    if (done) markDoneToday('/pares')
  }, [done])

  const choose = (o: PairSide) => {
    if (picked || !cur) return
    setPicked(o)
    setResults((r) => [...r, o === cur.answer])
  }
  const next = () => {
    setPicked(null)
    if (q + 1 < questions.length) setQ(q + 1)
  }

  const playing = !!cur && !done
  useHotkeys({
    '1': () => playing && choose(cur.options[0]),
    '2': () => playing && choose(cur.options[1]),
    ' ': () => playing && speak(cur.answer.hanzi),
    Enter: () => playing && picked && next(),
  })

  const failedGroups = useMemo(() => {
    const m = new Map<string, { group: PairGroup; bad: number }>()
    results.forEach((ok, i) => {
      if (ok) return
      const g = questions[i].group
      m.set(g.id, { group: g, bad: (m.get(g.id)?.bad ?? 0) + 1 })
    })
    return [...m.values()]
  }, [results, questions])

  const score = results.filter(Boolean).length

  return (
    <main className="screen">
      <ExerciseHeader title="Pares de sonidos" help="Dos sílabas casi iguales: ¿cuál has oído? Entrena el oído antes que los ojos." />
      <VoiceBanner />
      <label className="field">
        <span className="muted small-left">Contraste</span>
        <select className="search" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
          <option value="all">Todos mezclados</option>
          {PAIR_GROUPS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

      {done ? (
        <section className="card result pop">
          <h2>
            {score >= 8 ? '🎉' : score >= 5 ? '👍' : '💪'} {score} de {questions.length}
          </h2>
          {failedGroups.length ? (
            <>
              <p className="muted">Te han costado estos sonidos:</p>
              {failedGroups.map(({ group, bad }) => (
                <div key={group.id} className="tip">
                  <strong>{group.label}</strong> <small className="muted">({bad} fallo{bad > 1 ? 's' : ''})</small>
                  <p className="small-left">{group.tip}</p>
                  <button className="link-btn" onClick={() => setGroupId(group.id)}>
                    Practicar solo {group.label}
                  </button>
                </div>
              ))}
            </>
          ) : (
            <p>¡Oído fino! Ningún fallo.</p>
          )}
          <button className="btn btn-primary" onClick={() => setRound(round + 1)}>
            Otra ronda
          </button>
          <Link to="/aprender/pinyin" className="btn btn-center">
            📖 Repasar cómo se pronuncia
          </Link>
        </section>
      ) : (
        cur && (
          <>
            <ProgressDots total={questions.length} current={q} results={questions.map((_, i) => results[i])} />
            <button className="listen-big" onClick={() => speak(cur.answer.hanzi)} aria-label="Escuchar otra vez">
              🔊
              <small>
                {cur.group.label} · toca para repetir <span className="kbd-hint">(espacio)</span>
              </small>
            </button>
            <SlowButton text={cur.answer.hanzi} />
            <div className="options">
              {cur.options.map((o, i) => {
                const cls = !picked ? '' : o === cur.answer ? 'ok' : o === picked ? 'bad' : 'dim'
                return (
                  <button key={o.pinyin} className={`option ${cls}`} onClick={() => choose(o)}>
                    <span className="kbd-hint kbd-corner">{i + 1}</span>
                    <span className="option-pinyin">
                      <TonedPinyin pinyin={o.pinyin} />
                    </span>
                    {picked && (
                      <small className="muted">
                        <span className="hanzi">{o.hanzi}</span> · {o.meaning}
                      </small>
                    )}
                  </button>
                )
              })}
            </div>
            {picked && (
              <div className={`card quiz-feedback pop ${picked === cur.answer ? '' : 'feedback-bad'}`}>
                <strong>{picked === cur.answer ? '✓ ¡Bien!' : `✗ Era «${cur.answer.pinyin}»`}</strong>
                <p className="small-left">{cur.group.tip}</p>
                <div className="compare-row">
                  {cur.options.map((o) => (
                    <span key={o.pinyin} className="compare-item">
                      <TonedPinyin pinyin={o.pinyin} /> <SpeakerButton text={o.hanzi} />
                    </span>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={next}>
                  {q + 1 < questions.length ? 'Siguiente' : 'Ver resultado'}
                </button>
              </div>
            )}
          </>
        )
      )}
    </main>
  )
}
