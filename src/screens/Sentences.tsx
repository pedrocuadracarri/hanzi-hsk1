import { useEffect, useMemo, useState } from 'react'
import { ALL_WORDS } from '../data'
import { getExample, sentenceText, sentenceTokens } from '../data/examples'
import { buildRound } from '../lib/rounds'
import { shuffle } from '../lib/random'
import { speak } from '../lib/speech'
import { usePinyinHint } from '../lib/pinyinHint'
import { useHotkeys } from '../lib/useHotkeys'
import { useWordSession } from '../exercises/useWordSession'
import ExerciseHeader from '../components/ExerciseHeader'
import VoiceBanner from '../components/VoiceBanner'
import NewWordsIntro from '../components/NewWordsIntro'
import RoundResult from '../components/RoundResult'
import ProgressDots from '../components/ProgressDots'
import { TonedPinyin } from '../components/Toned'

const QUESTIONS = 5

/** Pinyin de cada pieza: palabras del temario y algunas piezas sueltas de las frases */
const EXTRA_PINYIN: Record<string, string> = { 饭: 'fàn', 车: 'chē', 国: 'guó', 天: 'tiān', 这些: 'zhèxiē' }
const IDS = new Map(ALL_WORDS.map((w) => [w.hanzi, w.id] as [string, string]))
const PINYIN = new Map<string, string>([...ALL_WORDS.map((w) => [w.hanzi, w.pinyin] as [string, string]), ...Object.entries(EXTRA_PINYIN)])

interface Tile {
  key: number
  text: string
}

export default function Sentences() {
  const hint = usePinyinHint()
  const s = useWordSession((progress, today) =>
    buildRound({ words: ALL_WORDS, progress, mode: 'meaning', today, size: QUESTIONS }),
  )
  const [q, setQ] = useState(0)
  const [placed, setPlaced] = useState<number[]>([])
  const [checked, setChecked] = useState<boolean | null>(null)

  useEffect(() => {
    setQ(0)
    setPlaced([])
    setChecked(null)
  }, [s.roundKey])

  const word = s.stage === 'play' ? s.words[q] : undefined
  const ex = word ? getExample(word.id) : undefined
  const tiles: Tile[] = useMemo(() => (ex ? sentenceTokens(ex).map((text, key) => ({ key, text })) : []), [ex])
  const bank = useMemo(() => shuffle(tiles), [tiles])

  const add = (k: number) => checked === null && setPlaced((p) => (p.includes(k) ? p : [...p, k]))
  const remove = (k: number) => checked === null && setPlaced((p) => p.filter((x) => x !== k))

  const check = () => {
    if (!word || !ex || placed.length !== tiles.length || checked !== null) return
    // Se compara el texto: si hay piezas repetidas (我…我), cualquier orden equivalente vale
    const ok = placed.map((k) => tiles[k].text).join('') === tiles.map((t) => t.text).join('')
    setChecked(ok)
    s.answer(word.id, ok)
    speak(sentenceText(ex))
  }

  const next = () => {
    // Se limpia aquí (no en un efecto) para no pintar piezas de la frase anterior
    setPlaced([])
    setChecked(null)
    if (q + 1 >= s.words.length) s.finish()
    else setQ(q + 1)
  }

  useHotkeys({
    Enter: () => (checked === null ? check() : next()),
    Backspace: () => placed.length && remove(placed[placed.length - 1]),
  })

  let body = null
  if (s.stage === 'intro') body = <NewWordsIntro words={s.newWords} onDone={s.play} />
  else if (s.stage === 'done') body = <RoundResult words={s.words} results={s.results} onNext={s.restart} />
  else if (word && ex) {
    const full = placed.length === tiles.length
    body = (
      <>
        <ProgressDots total={s.words.length} current={q} results={s.words.map((w) => s.results.get(w.id))} />
        <div className="card sentence-prompt">
          <small className="muted">Traduce al chino</small>
          <strong className="sentence-es">{ex.es.replace(/\s*\(.*\)$/, '')}</strong>
          <button className="btn btn-sm" onClick={() => speak(sentenceText(ex))}>
            🔊 Escuchar la frase
          </button>
        </div>

        <div className={`sentence-answer ${checked === true ? 'ok' : checked === false ? 'bad' : ''}`} aria-label="Tu frase">
          {placed.length === 0 && <span className="muted">Toca las palabras en orden…</span>}
          {placed.map((k) => (
            <button key={k} className="word-tile" onClick={() => remove(k)}>
              <span className="hanzi">{tiles[k].text}</span>
              {hint(IDS.get(tiles[k].text)) && (
                <small>
                  <TonedPinyin pinyin={PINYIN.get(tiles[k].text) ?? ''} />
                </small>
              )}
            </button>
          ))}
        </div>

        <div className="sentence-bank">
          {bank.map((t) => (
            <button
              key={t.key}
              className={`word-tile ${placed.includes(t.key) ? 'used' : ''}`}
              onClick={() => add(t.key)}
              disabled={placed.includes(t.key)}
            >
              <span className="hanzi">{t.text}</span>
              {hint(IDS.get(t.text)) && (
                <small>
                  <TonedPinyin pinyin={PINYIN.get(t.text) ?? ''} />
                </small>
              )}
            </button>
          ))}
        </div>

        {checked === null ? (
          <button className="btn btn-primary" onClick={check} disabled={!full}>
            Comprobar
          </button>
        ) : (
          <div className={`card sentence-feedback pop ${checked ? 'ok' : 'bad'}`}>
            <strong>{checked ? '✅ ¡Correcto!' : '❌ Casi. La frase correcta es:'}</strong>
            <span className="hanzi sentence-zh">{sentenceText(ex)}</span>
            <span>{ex.py}</span>
            <span className="muted">{ex.es}</span>
            <button className="btn btn-primary" onClick={next} autoFocus>
              Continuar
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <main className="screen">
      <ExerciseHeader
        title="Ordenar frases"
        help="Toca las palabras en orden. Truco: quién + cuándo + dónde + qué hace. El «cuándo» y el «dónde» van antes del verbo: 我明天去北京 = yo mañana voy Pekín."
      />
      <VoiceBanner />
      {body}
    </main>
  )
}
