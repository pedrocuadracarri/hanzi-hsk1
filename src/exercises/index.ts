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
  /** Sección en la lista de Practicar */
  group: 'basico' | 'oido' | 'uso'
}

export const EXERCISES: ExerciseInfo[] = [
  {
    id: 'review',
    title: 'Repaso mixto',
    description: 'Lo que te toca repasar, con preguntas variadas: significado, carácter, oído y pinyin',
    path: '/repaso',
    icon: '🔀',
    srs: true,
    group: 'basico',
  },
  {
    id: 'match',
    title: 'Emparejar',
    description: 'Une cada carácter con su emoji, significado, pinyin o pieza',
    path: '/emparejar',
    icon: '🧩',
    beginner: true,
    srs: true,
    group: 'basico',
  },
  {
    id: 'flashcards',
    title: 'Tarjetas',
    description: 'Mira el carácter, intenta recordarlo y gira la tarjeta',
    path: '/tarjetas',
    icon: '🃏',
    beginner: true,
    srs: true,
    group: 'basico',
  },
  {
    id: 'listen',
    title: 'Escuchar',
    description: 'Oye una palabra y elige el carácter correcto',
    path: '/escuchar',
    icon: '👂',
    srs: true,
    group: 'oido',
  },
  {
    id: 'write',
    title: 'Escribir',
    description: 'Traza el carácter con el dedo en el orden correcto',
    path: '/escribir',
    icon: '✍️',
    srs: true,
    group: 'uso',
  },
  {
    id: 'type-pinyin',
    title: 'Escribir pinyin',
    description: 'Escucha y teclea cómo suena, con sus tonos (ni3 hao3)',
    path: '/escribir-pinyin',
    icon: '⌨️',
    srs: true,
    group: 'oido',
  },
  {
    id: 'sentences',
    title: 'Ordenar frases',
    description: 'Construye frases reales en chino: así se aprende la gramática sin estudiarla',
    path: '/frases',
    icon: '🧱',
    srs: true,
    group: 'uso',
  },
  {
    id: 'exam',
    title: 'Simulacro HSK 1',
    description: '20 preguntas de todo el temario: ¿aprobarías el examen hoy?',
    path: '/examen',
    icon: '🏅',
    srs: false,
    group: 'uso',
  },
  {
    id: 'tones',
    title: 'Tonos',
    description: 'Entrena el oído: ¿qué tono has escuchado?',
    path: '/tonos',
    icon: '🎵',
    srs: false,
    group: 'oido',
  },
]
