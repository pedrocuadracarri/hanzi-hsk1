import { speak } from '../lib/speech'

/** Repetir muy despacio: para distinguir bien los tonos */
export default function SlowButton({ text }: { text: string }) {
  return (
    <button type="button" className="btn btn-sm slow-btn" onClick={() => speak(text, { slow: true })} aria-label="Escuchar despacio">
      🐢 Despacio
    </button>
  )
}
