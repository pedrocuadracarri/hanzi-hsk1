import { useEffect, useState } from 'react'
import { ALL_WORDS } from '../data'
import { buildRound } from '../lib/rounds'
import { speak } from '../lib/speech'
import { getSettings } from '../lib/settings'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import RoundResult from '../components/RoundResult'
import SpeakerButton from '../components/SpeakerButton'
import ProgressDots from '../components/ProgressDots'
import { useHotkeys } from '../lib/useHotkeys'

export default function Flashcards() {
  const s = useWordSession(
    (progress, today) => buildRound({ words: ALL_WORDS, progress, mode: 'meaning', today, size: 10 }),
    [],
    { intro: false },
  )
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    setI(0)
    setShown(false)
  }, [s.roundKey])

  const w = s.words[i]

  const reveal = () => {
    setShown(true)
    if (getSettings().autoplay) speak(w.hanzi)
  }
  const rate = (ok: boolean) => {
    s.answer(w.id, ok)
    setShown(false)
    if (i + 1 >= s.words.length) s.finish()
    else setI(i + 1)
  }

  const playing = s.stage === 'play' && !!w
  useHotkeys({
    ' ': () => playing && !shown && reveal(),
    Enter: () => playing && !shown && reveal(),
    ArrowLeft: () => playing && shown && rate(false),
    '1': () => playing && shown && rate(false),
    ArrowRight: () => playing && shown && rate(true),
    '2': () => playing && shown && rate(true),
  })

  return (
    <main className="screen">
      <ExerciseHeader title="Tarjetas" help="¿Recuerdas qué significa? Piénsalo, gira la tarjeta y sé sincero." />
      {s.stage === 'done' && <RoundResult words={s.words} results={s.results} onNext={s.restart} />}
      {s.stage === 'play' && w && (
        <>
          <ProgressDots total={s.words.length} current={i} results={s.words.map((x) => s.results.get(x.id))} />
          <div className={`flashcard card ${shown ? 'flipped' : ''}`} onClick={() => !shown && reveal()}>
            <div className="flash-hanzi hanzi">{w.hanzi}</div>
            {shown ? (
              <div className="flash-back pop">
                <div className="intro-pinyin">
                  {w.pinyin} <SpeakerButton text={w.hanzi} size="lg" />
                </div>
                <div className="intro-meaning">
                  {w.emoji} {w.meaning}
                </div>
                <p className="intro-mnemonic">💡 {w.mnemonic}</p>
              </div>
            ) : (
              <p className="muted">
                Toca para ver la respuesta <span className="kbd-hint">(espacio)</span>
              </p>
            )}
          </div>
          {shown && (
            <div className="rate-row">
              <button className="btn btn-bad" onClick={() => rate(false)}>
                😕 No lo sabía <span className="kbd-hint">←</span>
              </button>
              <button className="btn btn-ok" onClick={() => rate(true)}>
                😊 Lo sabía <span className="kbd-hint">→</span>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
