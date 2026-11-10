import { useEffect, useState } from 'react'

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

export function speak(text: string) {
  if (!supported) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.8
  const voice = findZhVoice()
  if (voice) u.voice = voice
  speechSynthesis.speak(u)
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
