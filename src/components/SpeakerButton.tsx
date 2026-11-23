import { speak } from '../lib/speech'

interface Props {
  text: string
  size?: 'sm' | 'lg'
}

export default function SpeakerButton({ text, size = 'sm' }: Props) {
  return (
    <button
      type="button"
      className={`speaker speaker-${size}`}
      aria-label={`Escuchar ${text}`}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        speak(text)
      }}
    >
      🔊
    </button>
  )
}
