import { useEffect, useState } from 'react'
import type { Word } from '../types'
import { speak } from '../lib/speech'
import { getSettings } from '../lib/settings'
import { markKnown } from '../lib/storage'
import SpeakerButton from './SpeakerButton'
import ExampleSentence from './ExampleSentence'
import Pieces from './Pieces'
import { TonedHanzi, TonedPinyin } from './Toned'

interface Props {
  words: Word[]
  onDone: () => void
}

/** Presenta las palabras nuevas antes de practicarlas */
export default function NewWordsIntro({ words, onDone }: Props) {
  const [i, setI] = useState(0)
  const w = words[i]

  useEffect(() => {
    if (getSettings().autoplay) speak(w.hanzi)
  }, [w])

  const last = i === words.length - 1
  const advance = () => (last ? onDone() : setI(i + 1))
  const known = () => {
    void markKnown([w.id])
    advance()
  }
  return (
    <div className="intro card pop" key={w.id}>
      <div className="intro-top">
        <span className="badge">✨ Palabra nueva {i + 1}/{words.length}</span>
        <button className="link-btn" onClick={onDone}>
          Saltar
        </button>
      </div>
      {w.emoji && <div className="intro-emoji">{w.emoji}</div>}
      <div className="intro-hanzi hanzi">
        <TonedHanzi hanzi={w.hanzi} pinyin={w.pinyin} />
      </div>
      <div className="intro-pinyin">
        <TonedPinyin pinyin={w.pinyin} /> <SpeakerButton text={w.hanzi} size="lg" />
      </div>
      <div className="intro-meaning">{w.meaning}</div>
      <Pieces word={w} />
      <p className="intro-mnemonic">💡 {w.mnemonic}</p>
      <ExampleSentence word={w} />
      <div className="intro-actions">
        <button className="btn" onClick={known} title="La conoces de antes (p. ej. de Duolingo): pasa directamente a aprendida">
          ✓ Ya la sé
        </button>
        <button className="btn btn-primary" onClick={advance}>
          {last ? '¡A practicar!' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}
