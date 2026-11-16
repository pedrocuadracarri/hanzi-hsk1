import { useEffect, useRef } from 'react'

/** Atajos de teclado para jugar en el PC. Las teclas son `KeyboardEvent.key` (' ' = espacio). */
export function useHotkeys(map: Record<string, () => void>) {
  const ref = useRef(map)
  ref.current = map
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      const t = e.target
      if (t instanceof Element && t.closest('input, textarea, select, [contenteditable]')) return
      const fn = ref.current[e.key]
      if (!fn) return
      e.preventDefault()
      fn()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
