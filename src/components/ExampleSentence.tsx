import type { Word } from '../types'
import { getExample, sentenceText } from '../data/examples'
import SpeakerButton from './SpeakerButton'
import RecordCompare from './RecordCompare'

/** Frase de ejemplo con la palabra resaltada, pinyin, traducción y audio */
export default function ExampleSentence({ word, record = false }: { word: Word; record?: boolean }) {
  const ex = getExample(word.id)
  if (!ex) return null
  const text = sentenceText(ex)
  const parts = text.split(word.hanzi)
  return (
    <div className="example">
      <div className="example-row">
        <span className="hanzi example-zh">
          {parts.map((p, i) => (
            <span key={i}>
              {p}
              {i < parts.length - 1 && <mark>{word.hanzi}</mark>}
            </span>
          ))}
        </span>
        <SpeakerButton text={text} />
      </div>
      <span className="example-py">{ex.py}</span>
      <span className="muted">{ex.es}</span>
      {record && <RecordCompare text={text} />}
    </div>
  )
}
