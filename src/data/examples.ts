import raw from './examples.json'

/** Frase de ejemplo. `zh` va separado por espacios en palabras (y signos). */
export interface Example {
  zh: string
  py: string
  es: string
}

const EXAMPLES = raw as Record<string, Example>
const PUNCT = /^[。？！，]$/

export const getExample = (wordId: string): Example | undefined => EXAMPLES[wordId]

/** Texto chino tal cual se escribe (sin espacios) */
export const sentenceText = (e: Example) => e.zh.replace(/ /g, '')

/** Palabras de la frase, sin signos de puntuación */
export const sentenceTokens = (e: Example) => e.zh.split(' ').filter((t) => !PUNCT.test(t))
