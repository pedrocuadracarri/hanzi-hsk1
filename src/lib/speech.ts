import { useEffect, useState } from 'react'
import { getSettings } from './settings'

export type VoiceStatus = 'checking' | 'ok' | 'missing' | 'unsupported'

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

function findZhVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  const norm = (l: string) => l.replace('_', '-').toLowerCase()
  return (
    voices.find((v) => norm(v.lang) === 'zh-cn') ??
    voices.find((v) => norm(v.lang).startsWith('cmn')) ??
    voices.find((v) => norm(v.lang).startsWith('zh') && !/hk|yue/.test(norm(v.lang)))
  )
}

/** Las voces se cargan de forma asíncrona en muchos navegadores */
function waitForVoices(timeoutMs = 2000): Promise<void> {
  if (speechSynthesis.getVoices().length) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      speechSynthesis.removeEventListener('voiceschanged', done)
      resolve()
    }
    speechSynthesis.addEventListener('voiceschanged', done)
    setTimeout(done, timeoutMs)
  })
}

function utterance(text: string, rate = getSettings().rate) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = rate
  const voice = findZhVoice()
  if (voice) u.voice = voice
  return u
}

/* Muchos dispositivos (auriculares Bluetooth, Android, Windows) apagan la salida de audio
 * tras unos segundos en silencio y tardan 1-2 s en encenderla: el principio de la palabra
 * se pierde. Un sonido inaudible continuo mantiene la salida despierta mientras la app
 * está visible; si acaba de despertarse, esperamos un momento antes de hablar. */
let ctx: AudioContext | undefined
let awakeSince = 0
const WAKE_DELAY = 500

function keepAudioAwake(): number {
  try {
    if (!ctx) {
      ctx = new AudioContext()
      const src = ctx.createConstantSource()
      const gain = ctx.createGain()
      gain.gain.value = 0.0001
      src.connect(gain).connect(ctx.destination)
      src.start()
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) void ctx?.suspend()
      })
    }
    if (ctx.state !== 'running') {
      void ctx.resume()
      awakeSince = performance.now()
    }
    return Math.max(0, WAKE_DELAY - (performance.now() - awakeSince))
  } catch {
    return 0
  }
}

let pending: ReturnType<typeof setTimeout> | undefined

/** Corta lo que suene y ejecuta `run` cuando la salida de audio esté lista */
function whenReady(run: () => void) {
  clearTimeout(pending)
  const busy = speechSynthesis.speaking || speechSynthesis.pending
  if (busy) speechSynthesis.cancel()
  // Chrome a veces recorta lo que se dice justo después de cancel()
  const wait = Math.max(keepAudioAwake(), busy ? 80 : 0)
  if (wait) pending = setTimeout(run, wait)
  else run()
}

export function speak(text: string, { slow = false }: { slow?: boolean } = {}) {
  if (!supported) return
  whenReady(() => speechSynthesis.speak(utterance(text, slow ? 0.5 : undefined)))
}

/** Lee varias frases seguidas; `onLine` avisa de cuál está sonando */
export function speakAll(texts: string[], onLine?: (i: number | null) => void) {
  if (!supported) return
  whenReady(() =>
    texts.forEach((t, i) => {
      const u = utterance(t)
      u.onstart = () => onLine?.(i)
      if (i === texts.length - 1) u.onend = () => onLine?.(null)
      speechSynthesis.speak(u)
    }),
  )
}

export function useZhVoice(): VoiceStatus {
  const [status, setStatus] = useState<VoiceStatus>(supported ? 'checking' : 'unsupported')
  useEffect(() => {
    if (!supported) return
    let alive = true
    waitForVoices().then(() => {
      if (alive) setStatus(findZhVoice() ? 'ok' : 'missing')
    })
    return () => {
      alive = false
    }
  }, [])
  return status
}
