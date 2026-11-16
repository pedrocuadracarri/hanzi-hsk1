import { useEffect, useMemo, useState } from 'react'
import { ALL_WORDS } from '../data'
import { buildRound, pickDistractors } from '../lib/rounds'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import { useSettings } from '../lib/settings'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ProgressDots from '../components/ProgressDots'
import SlowButton from '../components/SlowButton'
import { useHotkeys } from '../lib/useHotkeys'

const QUESTIONS = 6

export default function Listen() {
  const settings = useSettings()
  const s = useWordSession((progress, today) =>
    buildRound({ words: ALL_WORDS, progress, mode: 'pinyin', today, size: QUESTIONS }),
  )
  const [q, setQ] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    setQ(0)
    setPicked(null)
  }, [s.roundKey])

  const word = s.words[q]
  const options = useMemo(
    () => (word ? shuffle([word, ...pickDistractors(word, ALL_WORDS, 3, (w) => w.pinyin)]) : []),
    [word],
  )

  useEffect(() => {
    if (s.stage === 'play' && word) {
      const t = setTimeout(() => speak(word.hanzi), 300)
      return () => clearTimeout(t)
    }
  }, [s.stage, word])

  const next = () => {
    setPicked(null)
    if (q + 1 >= s.words.length) s.finish()
    else setQ(q + 1)
  }

  const choose = (id: string) => {
    if (picked) return
    setPicked(id)
    const ok = id === word.id
    s.answer(word.id, ok)
    if (ok) setTimeout(next, 900)
  }

  const playing = s.stage === 'play' && !!word
  useHotkeys({
    ...Object.fromEntries(options.map((o, i) => [String(i + 1), () => playing && choose(o.id)])),
    ' ': () => playing && speak(word.hanzi),
    Enter: () => playing && picked && picked !== word.id && next(),
  })

  let body = null
  if (s.stage === 'intro') body = <NewWordsIntro words={s.newWords} onDone={s.play} />
  else if (s.stage === 'done') body = <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  else if (s.stage === 'play' && word)
    body = (
      <>
        <ProgressDots total={s.words.length} current={q} results={s.words.map((w) => s.results.get(w.id))} />
        <button className="listen-big" onClick={() => speak(word.hanzi)} aria-label="Escuchar otra vez">
          🔊
          <small>
            Toca para repetir <span className="kbd-hint">(espacio)</span>
          </small>
        </button>
        <SlowButton text={word.hanzi} />
        <div className="options">
          {options.map((o, i) => {
            const cls = !picked ? '' : o.id === word.id ? 'ok' : o.id === picked ? 'bad' : 'dim'
            return (
              <button key={o.id} className={`option ${cls}`} onClick={() => choose(o.id)}>
                <span className="kbd-hint kbd-corner">{i + 1}</span>
                <span className="hanzi">{o.hanzi}</span>
                {(settings.pinyinHint || picked) && <small>{o.pinyin}</small>}
                {picked && <small className="muted">{o.meaning}</small>}
              </button>
            )
          })}
        </div>
        {picked && picked !== word.id && (
          <button className="btn btn-primary" onClick={next}>
            Continuar
          </button>
        )}
      </>
    )

  return (
    <main className="screen">
      <ExerciseHeader title="Escuchar" help="Escucha la palabra y elige cuál es." />
      <VoiceBanner />
      {body}
    </main>
  )
}
