import { useEffect, useRef, useState } from 'react'
import HanziWriter from 'hanzi-writer'

interface Props {
  char: string
  size?: number
}

/** Animación del orden de trazos. Los datos se descargan de jsDelivr
 *  y el service worker los guarda en caché para usarlos offline. */
export default function StrokeAnimation({ char, size = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    setError(false)
    ref.current.innerHTML = ''
    const css = getComputedStyle(document.documentElement)
    const color = (v: string) => css.getPropertyValue(v).trim()
    writer.current = HanziWriter.create(ref.current, char, {
      width: size,
      height: size,
      padding: 8,
      showOutline: true,
      strokeColor: color('--text'),
      outlineColor: color('--border'),
      radicalColor: color('--accent'),
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,
      onLoadCharDataError: () => setError(true),
    })
    writer.current.animateCharacter()
    return () => {
      writer.current = null
    }
  }, [char, size])

  return (
    <div className="stroke-box">
      <div ref={ref} className="stroke-canvas" style={{ width: size, height: size }} />
      {error ? (
        <p className="muted small">
          Sin conexión: abre esta ficha una vez con internet y quedará guardada para usarla offline.
        </p>
      ) : (
        <button className="btn" onClick={() => writer.current?.animateCharacter()}>
          ▶ Repetir trazos
        </button>
      )}
    </div>
  )
}
