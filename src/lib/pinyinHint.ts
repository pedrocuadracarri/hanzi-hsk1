import { useCallback } from 'react'
import { useSettings } from './settings'
import { useProgress } from './useProgress'
import { isLearned } from './srs'

/** ¿Mostrar el pinyin de ayuda para esta palabra? En modo «learning» se oculta
 *  cuando la palabra ya está aprendida (caja 3+). Sin id, cuenta como no aprendida. */
export function usePinyinHint(): (wordId?: string) => boolean {
  const { pinyinMode } = useSettings()
  const { progress } = useProgress()
  return useCallback(
    (wordId?: string) => {
      if (pinyinMode === 'always') return true
      if (pinyinMode === 'never') return false
      const card = wordId ? progress[wordId] : undefined
      return !card || !isLearned(card)
    },
    [pinyinMode, progress],
  )
}
