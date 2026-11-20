import { useEffect, useState } from 'react'
import type { Word } from '../types'
import { speak } from '../lib/speech'
import { getSettings } from '../lib/settings'
import { markKnown, markSeen } from '../lib/storage'
import SpeakerButton from './SpeakerButton'
import ExampleSentence from './ExampleSentence'
import Pieces from './Pieces'
import { WordPictos } from './Pictographs'
import { TonedHanzi, TonedPinyin } from './Toned'
import { useHotkeys } from '../lib/useHotkeys'

interface Props {
  words: Word[]
  onDone: () => void
  /** Texto del botón final */
  doneLabel?: string
  /** Etiqueta de la insignia superior */
  label?: string
}

/** Presenta palabras una a una, con ida y vuelta. Lo visto queda guardado como «en curso». */
export default function NewWordsIntro({ words, onDone, doneLabel = '¡A practicar!', label = '✨ Palabra nueva' }: Props) {
  const [i, setI] = useState(0)
  const w = words[i]

  useEffect(() => {
    if (getSettings().autoplay) speak(w.hanzi)
    void markSeen([w.id])
  }, [w])

  const last = i === words.length - 1
  const go = (n: number) => setI(Math.max(0, Math.min(words.length - 1, n)))
  const advance = () => (last ? onDone() : go(i + 1))
  const known = () => {
    void markKnown([w.id])
    advance()
  }
  useHotkeys({ ArrowLeft: () => go(i - 1), ArrowRight: advance })

  return (
    <div className="intro card pop" key={w.id}>
      <div className="intro-top">
        <span className="badge">
          {label} {i + 1}/{words.length}
        </span>
        <button className="link-btn" onClick={onDone}>
          {last ? 'Terminar' : 'Saltar'}
        </button>
      </div>
      {words.length > 1 && (
        <div className="intro-dots" role="tablist" aria-label="Palabras">
          {words.map((x, n) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={n === i}
              className={n === i ? 'on' : ''}
              onClick={() => go(n)}
              aria-label={`${x.hanzi}: ${x.meaning}`}
            >
              <span className="hanzi">{x.hanzi}</span>
            </button>
          ))}
        </div>
      )}
      {w.emoji && <div className="intro-emoji">{w.emoji}</div>}
      <div className="intro-hanzi hanzi">
        <TonedHanzi hanzi={w.hanzi} pinyin={w.pinyin} />
      </div>
      <div className="intro-pinyin">
        <TonedPinyin pinyin={w.pinyin} /> <SpeakerButton text={w.hanzi} size="lg" />
      </div>
      <div className="intro-meaning">{w.meaning}</div>
      <Pieces word={w} />
      <WordPictos word={w} />
      <p className="intro-mnemonic">💡 {w.mnemonic}</p>
      <ExampleSentence word={w} />
      <div className="intro-nav">
        <button className="btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Palabra anterior">
          ←
        </button>
        <button className="btn btn-primary" onClick={advance}>
          {last ? doneLabel : 'Siguiente →'}
        </button>
      </div>
      <button className="link-btn" onClick={known} title="La conoces de antes (p. ej. de Duolingo): pasa directamente a aprendida">
        ✓ Ya me la sé, pasar a aprendida
      </button>
    </div>
  )
}
