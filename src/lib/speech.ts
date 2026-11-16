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

export function speak(text: string, { slow = false }: { slow?: boolean } = {}) {
  if (!supported) return
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance(text, slow ? 0.5 : undefined))
}

/** Lee varias frases seguidas; `onLine` avisa de cuál está sonando */
export function speakAll(texts: string[], onLine?: (i: number | null) => void) {
  if (!supported) return
  speechSynthesis.cancel()
  texts.forEach((t, i) => {
    const u = utterance(t)
    u.onstart = () => onLine?.(i)
    if (i === texts.length - 1) u.onend = () => onLine?.(null)
    speechSynthesis.speak(u)
  })
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
