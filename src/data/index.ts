import type { Category, Word } from '../types'
import hsk1 from './hsk1.json'

/** Orden en el que se introducen las palabras nuevas: de lo más útil
 *  para un principiante (saludos, pronombres, números) a lo más abstracto. */
export const CATEGORY_ORDER: Category[] = [
  'saludo',
  'pronombre',
  'número',
  'familia',
  'persona',
  'comida',
  'verbo',
  'adjetivo',
  'tiempo',
  'lugar',
  'pregunta',
  'objeto',
  'animal',
  'naturaleza',
  'transporte',
  'estudio',
  'medida',
  'adverbio',
  'partícula',
]

export const CATEGORY_LABELS: Record<Category, string> = {
  saludo: '👋 Saludos y cortesía',
  pronombre: '🙋 Pronombres',
  número: '🔢 Números',
  familia: '👨‍👩‍👧 Familia',
  persona: '🧑 Personas',
  comida: '🍚 Comida y bebida',
  verbo: '🏃 Verbos',
  adjetivo: '🎨 Adjetivos',
  tiempo: '⏰ Tiempo y fechas',
  lugar: '📍 Lugares y posiciones',
  pregunta: '❓ Preguntas',
  objeto: '📦 Objetos',
  animal: '🐾 Animales',
  naturaleza: '🌤️ Naturaleza y clima',
  transporte: '🚕 Transporte',
  estudio: '📚 Estudio',
  medida: '📏 Clasificadores',
  adverbio: '➕ Adverbios',
  partícula: '🔣 Partículas',
}

const sortByLearningOrder = (words: Word[]) =>
  [...words].sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category))

// Para añadir HSK 2: importar hsk2.json y añadirlo aquí.
export const LEVELS: Record<number, Word[]> = {
  1: sortByLearningOrder(hsk1 as Word[]),
}

export const ALL_WORDS: Word[] = Object.values(LEVELS).flat()

const byId = new Map(ALL_WORDS.map((w) => [w.id, w]))
export const getWord = (id: string): Word | undefined => byId.get(id)

/** Caracteres únicos de todas las palabras (para trazos y descargas) */
export const ALL_CHARS: string[] = [...new Set(ALL_WORDS.flatMap((w) => [...w.hanzi]))]
