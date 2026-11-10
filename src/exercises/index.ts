/** Registro de ejercicios. Para añadir uno nuevo, crea su pantalla,
 *  añade la ruta en App.tsx y regístralo aquí. */
export interface ExerciseInfo {
  id: string
  title: string
  description: string
  path: string
  icon: string
  /** Recomendado para quien empieza de cero */
  beginner?: boolean
  /** Actualiza el repaso espaciado */
  srs: boolean
}

export const EXERCISES: ExerciseInfo[] = [
  {
    id: 'match',
    title: 'Emparejar',
    description: 'Une cada carácter con su emoji, significado, pinyin o pieza',
    path: '/emparejar',
    icon: '🧩',
    beginner: true,
    srs: true,
  },
  {
    id: 'flashcards',
    title: 'Tarjetas',
    description: 'Mira el carácter, intenta recordarlo y gira la tarjeta',
    path: '/tarjetas',
    icon: '🃏',
    beginner: true,
    srs: true,
  },
  {
    id: 'listen',
    title: 'Escuchar',
    description: 'Oye una palabra y elige el carácter correcto',
    path: '/escuchar',
    icon: '👂',
    srs: true,
  },
  {
    id: 'write',
    title: 'Escribir',
    description: 'Traza el carácter con el dedo en el orden correcto',
    path: '/escribir',
    icon: '✍️',
    srs: true,
  },
  {
    id: 'tones',
    title: 'Tonos',
    description: 'Entrena el oído: ¿qué tono has escuchado?',
    path: '/tonos',
    icon: '🎵',
    srs: false,
  },
]
