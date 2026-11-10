import { useEffect, useState } from 'react'
import type { Word } from '../types'
import { speak } from '../lib/speech'
import { getSettings } from '../lib/settings'
import SpeakerButton from './SpeakerButton'

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
  return (
    <div className="intro card pop" key={w.id}>
      <div className="intro-top">
        <span className="badge">✨ Palabra nueva {i + 1}/{words.length}</span>
        <button className="link-btn" onClick={onDone}>
          Saltar
        </button>
      </div>
      {w.emoji && <div className="intro-emoji">{w.emoji}</div>}
      <div className="intro-hanzi hanzi">{w.hanzi}</div>
      <div className="intro-pinyin">
        {w.pinyin} <SpeakerButton text={w.hanzi} size="lg" />
      </div>
      <div className="intro-meaning">{w.meaning}</div>
      <p className="intro-mnemonic">💡 {w.mnemonic}</p>
      <button className="btn btn-primary" onClick={() => (last ? onDone() : setI(i + 1))}>
        {last ? '¡A practicar!' : 'Siguiente'}
      </button>
    </div>
  )
}
