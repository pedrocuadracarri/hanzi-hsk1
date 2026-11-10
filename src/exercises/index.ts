/** Registro de ejercicios. Para añadir uno nuevo (p. ej. escribir con el dedo
 *  usando el modo quiz de Hanzi Writer), crea su carpeta, su ruta en App.tsx
 *  y márcalo como disponible aquí. */
export interface ExerciseInfo {
  id: string
  title: string
  description: string
  path: string
  icon: string
  available: boolean
}

export const EXERCISES: ExerciseInfo[] = [
  {
    id: 'match',
    title: 'Emparejar',
    description: 'Une cada carácter con su emoji, pinyin o significado',
    path: '/emparejar',
    icon: '🧩',
    available: true,
  },
  {
    id: 'write',
    title: 'Escribir',
    description: 'Traza el carácter con el dedo',
    path: '/escribir',
    icon: '✍️',
    available: false,
  },
]
