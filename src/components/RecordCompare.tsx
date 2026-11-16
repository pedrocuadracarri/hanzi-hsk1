import { useEffect, useRef, useState } from 'react'
import { speak } from '../lib/speech'

const supported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && 'MediaRecorder' in window

/** Practica de pronunciación: escucha el modelo, grábate y compara */
export default function RecordCompare({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'recording' | 'done' | 'denied'>('idle')
  const [url, setUrl] = useState<string | null>(null)
  const rec = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    setState('idle')
    setUrl(null)
  }, [text])
  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url])

  if (!supported) return null

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: Blob[] = []
      const r = new MediaRecorder(stream)
      r.ondataavailable = (e) => chunks.push(e.data)
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const u = URL.createObjectURL(new Blob(chunks, { type: r.mimeType }))
        setUrl(u)
        setState('done')
        new Audio(u).play()
      }
      rec.current = r
      r.start()
      setState('recording')
      // Corte automático para no dejar el micro abierto
      setTimeout(() => r.state === 'recording' && r.stop(), 6000)
    } catch {
      setState('denied')
    }
  }
  const stop = () => rec.current?.state === 'recording' && rec.current.stop()

  return (
    <div className="record">
      {state === 'recording' ? (
        <button className="btn btn-sm btn-bad" onClick={stop}>
          ⏹ Parar
        </button>
      ) : (
        <button className="btn btn-sm" onClick={start}>
          🎙️ {state === 'done' ? 'Otra vez' : 'Grábate'}
        </button>
      )}
      {state === 'done' && url && (
        <>
          <button className="btn btn-sm" onClick={() => new Audio(url).play()}>
            ▶ Tú
          </button>
          <button className="btn btn-sm" onClick={() => speak(text)}>
            🔊 Modelo
          </button>
        </>
      )}
      {state === 'denied' && <small className="muted">Permite el micrófono para grabarte.</small>}
      {state === 'recording' && <small className="muted rec-dot">Grabando…</small>}
    </div>
  )
}
