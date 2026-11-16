import { toNumeric, splitNumeric } from '../lib/pinyin'
import { useSettings } from '../lib/settings'

const toneOf = (syl: string) => splitNumeric(toNumeric(syl)).tone

/** Pinyin con cada sílaba coloreada según su tono (si está activado en Ajustes) */
export function TonedPinyin({ pinyin }: { pinyin: string }) {
  const { toneColors } = useSettings()
  if (!toneColors) return <>{pinyin}</>
  const syls = pinyin.split(' ')
  return (
    <>
      {syls.map((s, i) => (
        <span key={i} className={`t${toneOf(s)}`}>
          {s}
          {i < syls.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

/** Caracteres coloreados por tono, usando el pinyin de la palabra (una sílaba por carácter) */
export function TonedHanzi({ hanzi, pinyin }: { hanzi: string; pinyin: string }) {
  const { toneColors } = useSettings()
  const chars = [...hanzi]
  const syls = pinyin.split(' ')
  if (!toneColors || chars.length !== syls.length) return <>{hanzi}</>
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} className={`t${toneOf(syls[i])}`}>
          {c}
        </span>
      ))}
    </>
  )
}
