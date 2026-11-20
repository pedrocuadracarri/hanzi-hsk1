import { useEffect, useState } from 'react'
import { ALL_WORDS } from '../data'
import { buildRound } from '../lib/rounds'
import { normalizePinyin } from '../lib/pinyin'
import { speak } from '../lib/speech'
import { usePinyinHint } from '../lib/pinyinHint'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ProgressDots from '../components/ProgressDots'
import SlowButton from '../components/SlowButton'
import { TonedPinyin } from '../components/Toned'

const QUESTIONS = 6

export default function TypePinyin() {
  const hint = usePinyinHint()
  const s = useWordSession((progress, today) =>
    buildRound({ words: ALL_WORDS, progress, mode: 'pinyin', today, size: QUESTIONS }),
  )
  const [q, setQ] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<'ok' | 'tones' | 'bad' | null>(null)

  useEffect(() => {
    setQ(0)
  }, [s.roundKey])

  const word = s.stage === 'play' ? s.words[q] : undefined

  useEffect(() => {
    if (!word) return
    setInput('')
    setResult(null)
    const t = setTimeout(() => speak(word.hanzi), 300)
    return () => clearTimeout(t)
  }, [word])

  const check = () => {
    if (!word || !input.trim() || result) return
    const got = normalizePinyin(input)
    const want = normalizePinyin(word.pinyinNumeric)
    const r = got === want ? 'ok' : got.replace(/\d/g, '') === want.replace(/\d/g, '') ? 'tones' : 'bad'
    setResult(r)
    s.answer(word.id, r === 'ok')
  }
  const next = () => {
    if (q + 1 >= s.words.length) s.finish()
    else setQ(q + 1)
  }

  let body = null
  if (s.stage === 'intro') body = <NewWordsIntro words={s.newWords} onDone={s.play} />
  else if (s.stage === 'done') body = <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  else if (word)
    body = (
      <>
        <ProgressDots total={s.words.length} current={q} results={s.words.map((w) => s.results.get(w.id))} />
        <button className="listen-big" onClick={() => speak(word.hanzi)} aria-label="Escuchar otra vez">
          {hint(word.id) ? <span className="hanzi">{word.hanzi}</span> : '🔊'}
          <small>
            {word.meaning} · toca para repetir 🔊
          </small>
        </button>
        <SlowButton text={word.hanzi} />
        <form
          className="type-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (result) next()
            else check()
          }}
        >
          <input
            className={`search type-input ${result ?? ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe el pinyin: ni3 hao3"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            readOnly={!!result}
            aria-label="Pinyin"
          />
          {result ? (
            <div className={`card sentence-feedback pop ${result === 'ok' ? 'ok' : 'bad'}`}>
              <strong>
                {result === 'ok' ? '✅ ¡Perfecto!' : result === 'tones' ? '🎵 Letras bien, revisa los tonos:' : '❌ Era:'}
              </strong>
              <span className="sheet-pinyin">
                <TonedPinyin pinyin={word.pinyin} />
              </span>
              <small className="muted">{word.pinyinNumeric}</small>
              <button className="btn btn-primary" type="submit" autoFocus>
                Continuar
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" type="submit" disabled={!input.trim()}>
              Comprobar
            </button>
          )}
        </form>
        <p className="muted small-left">
          Escribe cada sílaba con el número de su tono (1–4): <strong>ma1</strong> = mā, <strong>ma3</strong> = mǎ. El tono
          neutro puedes omitirlo. Para ü, escribe <strong>v</strong>.
        </p>
      </>
    )

  return (
    <main className="screen">
      <ExerciseHeader title="Escribir pinyin" help="Escucha la palabra y escribe cómo suena, con sus tonos." />
      <VoiceBanner />
      {body}
    </main>
  )
}
