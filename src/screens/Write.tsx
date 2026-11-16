import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'
import { ALL_WORDS } from '../data'
import { buildRound } from '../lib/rounds'
import { loadStrokeData } from '../lib/strokes'
import { speak } from '../lib/speech'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import SpeakerButton from '../components/SpeakerButton'
import ProgressDots from '../components/ProgressDots'
import VoiceBanner from '../components/VoiceBanner'

const SIZE = 280

export default function Write() {
  const s = useWordSession((progress, today) =>
    buildRound({ words: ALL_WORDS, progress, mode: 'meaning', today, size: 4 }),
  )
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [charDone, setCharDone] = useState(false)
  const [error, setError] = useState(false)
  // Dictado: solo se oye la palabra, sin significado ni pinyin
  const [dictation, setDictation] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  const mistakes = useRef(0)
  const helped = useRef(false)

  useEffect(() => {
    setWi(0)
    setCi(0)
  }, [s.roundKey])

  const word = s.words[wi]
  const chars = word ? [...word.hanzi] : []

  useEffect(() => {
    if (dictation && s.stage === 'play' && word) {
      const t = setTimeout(() => speak(word.hanzi), 300)
      return () => clearTimeout(t)
    }
  }, [dictation, s.stage, word])

  useEffect(() => {
    if (s.stage !== 'play' || !word || !box.current) return
    if (ci === 0) {
      mistakes.current = 0
      helped.current = false
    }
    setCharDone(false)
    setError(false)
    box.current.innerHTML = ''
    const css = getComputedStyle(document.documentElement)
    const color = (v: string) => css.getPropertyValue(v).trim()
    const w = HanziWriter.create(box.current, chars[ci], {
      width: SIZE,
      height: SIZE,
      padding: 10,
      showCharacter: false,
      showOutline: true,
      strokeColor: color('--text'),
      outlineColor: color('--border'),
      drawingColor: color('--sel'),
      highlightColor: color('--ok'),
      drawingWidth: 28,
      charDataLoader: (c, onLoad, onError) => {
        loadStrokeData(c).then(onLoad, onError)
      },
      onLoadCharDataError: () => setError(true),
    })
    writer.current = w
    w.quiz({
      showHintAfterMisses: 2,
      leniency: 1.3,
      onMistake: () => {
        mistakes.current++
      },
      onComplete: () => setCharDone(true),
    })
    return () => {
      writer.current = null
    }
  }, [s.stage, word, ci])

  const help = () => {
    helped.current = true
    writer.current?.cancelQuiz()
    writer.current?.showCharacter()
    writer.current?.animateCharacter({
      onComplete: () => {
        writer.current?.hideCharacter()
        writer.current?.quiz({ showHintAfterMisses: 1, onComplete: () => setCharDone(true) })
      },
    })
  }

  const next = () => {
    if (ci + 1 < chars.length) {
      setCi(ci + 1)
      return
    }
    // Correcta si no pidió ayuda y cometió pocos errores
    s.answer(word.id, !helped.current && mistakes.current <= 2 * chars.length)
    speak(word.hanzi)
    setCi(0)
    if (wi + 1 >= s.words.length) s.finish()
    else setWi(wi + 1)
  }

  return (
    <main className="screen">
      <ExerciseHeader
        title="Escribir"
        help="Traza el carácter con el dedo, trazo a trazo y en orden. Si fallas dos veces te enseña la pista."
      />
      <div className="segmented" role="tablist" aria-label="Modo">
        <button role="tab" aria-selected={!dictation} className={!dictation ? 'active' : ''} onClick={() => setDictation(false)}>
          Con pistas
        </button>
        <button role="tab" aria-selected={dictation} className={dictation ? 'active' : ''} onClick={() => setDictation(true)}>
          🎧 Dictado
        </button>
      </div>
      {dictation && <VoiceBanner />}
      {s.stage === 'intro' && <NewWordsIntro words={s.newWords} onDone={s.play} />}
      {s.stage === 'done' && <RoundResult words={s.words} results={s.results} onNext={s.restart} />}
      {s.stage === 'play' && word && (
        <>
          <ProgressDots total={s.words.length} current={wi} results={s.words.map((x) => s.results.get(x.id))} />
          <div className="write-prompt card">
            {dictation && !charDone ? (
              <button className="btn" onClick={() => speak(word.hanzi)}>
                🔊 Escuchar otra vez
              </button>
            ) : (
              <>
                <div className="intro-meaning">
                  {word.emoji} {word.meaning}
                </div>
                <div className="intro-pinyin">
                  {word.pinyin} <SpeakerButton text={word.hanzi} />
                </div>
              </>
            )}
            {chars.length > 1 && (
              <div className="write-chars">
                {chars.map((c, i) => (
                  <span key={i} className={`hanzi ${i < ci ? 'done' : i === ci ? 'now' : ''}`}>
                    {i < ci ? c : '？'}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="write-box">
            <div ref={box} className="write-canvas" style={{ width: SIZE, height: SIZE }} />
          </div>
          {error && <div className="banner">No se pudieron cargar los trazos. Conéctate a internet o descárgalos en Ajustes.</div>}
          {charDone ? (
            <button className="btn btn-primary" onClick={next}>
              {ci + 1 < chars.length ? 'Siguiente carácter' : 'Continuar'}
            </button>
          ) : (
            <button className="btn" onClick={help}>
              💡 Enséñame cómo se escribe
            </button>
          )}
        </>
      )}
    </main>
  )
}
