import type { ReactNode } from 'react'
import type { Word } from '../types'

/** Dibujos sencillos del objeto que originó cada carácter (viewBox 0 0 100 100, trazo sin relleno) */
export interface Picto {
  h: string
  p: string
  m: string
  draw: ReactNode
  /** Forma intermedia aproximada (ya con trazos de pincel), para los que cambiaron mucho */
  old?: ReactNode
}

const dot = (cx: number, cy: number, r = 6) => <circle cx={cx} cy={cy} r={r} fill="currentColor" />

const BASE: Picto[] = [
  {
    h: '人',
    p: 'rén',
    m: 'persona: alguien caminando de perfil',
    draw: (
      <>
        <circle cx="50" cy="18" r="9" />
        <path d="M50 27 L50 58 M50 36 L32 50 M50 36 L68 50 M50 58 L30 90 M50 58 L72 90" />
      </>
    ),
  },
  {
    h: '女',
    p: 'nǚ',
    m: 'mujer: una figura arrodillada con los brazos cruzados',
    draw: (
      <>
        <circle cx="50" cy="16" r="8" />
        <path d="M50 24 Q42 52 30 88 M50 24 Q58 52 70 88 M22 44 L78 60 M76 40 L28 68" />
      </>
    ),
  },
  {
    h: '子',
    p: 'zǐ',
    m: 'niño: un bebé envuelto, con los brazos fuera',
    draw: (
      <>
        <circle cx="50" cy="20" r="12" />
        <path d="M16 44 Q50 54 84 44 M50 32 L50 80 Q50 92 36 88" />
      </>
    ),
  },
  {
    h: '大',
    p: 'dà',
    m: 'grande: una persona con los brazos bien abiertos',
    draw: (
      <>
        <circle cx="50" cy="16" r="8" />
        <path d="M50 24 L50 56 M10 40 L90 40 M50 56 L22 92 M50 56 L78 92" />
      </>
    ),
  },
  {
    h: '小',
    p: 'xiǎo',
    m: 'pequeño: tres granitos de arena',
    draw: (
      <>
        {dot(50, 26, 9)}
        {dot(26, 66, 9)}
        {dot(74, 66, 9)}
      </>
    ),
  },
  {
    h: '上',
    p: 'shàng',
    m: 'arriba: algo por encima de una línea',
    draw: (
      <>
        <path d="M10 76 L90 76 M50 50 L50 16 M40 26 L50 16 L60 26" />
        {dot(50, 60, 7)}
      </>
    ),
  },
  {
    h: '下',
    p: 'xià',
    m: 'abajo: algo por debajo de una línea',
    draw: (
      <>
        <path d="M10 24 L90 24 M50 50 L50 84 M40 74 L50 84 L60 74" />
        {dot(50, 40, 7)}
      </>
    ),
  },
  {
    h: '中',
    p: 'zhōng',
    m: 'centro: una flecha que atraviesa la diana por el medio',
    draw: <path d="M22 34 L78 34 L78 66 L22 66 Z M50 6 L50 94 M42 14 L50 6 L58 14" />,
  },
  {
    h: '口',
    p: 'kǒu',
    m: 'boca: se cuadró al escribirla con pincel',
    draw: (
      <>
        <ellipse cx="50" cy="52" rx="36" ry="22" />
        <path d="M18 52 Q50 64 82 52" />
      </>
    ),
  },
  {
    h: '目',
    p: 'mù',
    m: 'ojo: dibujado de lado y luego puesto en vertical',
    draw: (
      <>
        <path d="M8 50 Q50 14 92 50 Q50 86 8 50 Z" />
        <circle cx="50" cy="50" r="12" />
        {dot(50, 50, 4)}
      </>
    ),
  },
  {
    h: '手',
    p: 'shǒu',
    m: 'mano: la palma con los dedos abiertos',
    draw: <path d="M32 92 Q28 64 34 52 L66 52 Q72 64 68 92 M36 52 L28 20 M45 52 L43 12 M55 52 L57 12 M64 52 L72 20 M67 64 L88 48" />,
  },
  {
    h: '心',
    p: 'xīn',
    m: 'corazón: el órgano, con sus cavidades',
    draw: (
      <>
        <path d="M50 88 C10 60 14 22 36 22 C46 22 50 32 50 38 C50 32 54 22 64 22 C86 22 90 60 50 88 Z" />
        <path d="M38 40 Q36 52 44 60 M62 40 Q64 52 56 60" />
      </>
    ),
  },
  {
    h: '日',
    p: 'rì',
    m: 'sol (y «día»): el círculo se hizo cuadrado al escribirlo con pincel y el punto, una raya',
    draw: (
      <>
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="5" fill="currentColor" />
        <path d="M50 6 L50 14 M50 86 L50 94 M6 50 L14 50 M86 50 L94 50 M19 19 L25 25 M75 75 L81 81 M81 19 L75 25 M19 81 L25 75" />
      </>
    ),
  },
  {
    h: '月',
    p: 'yuè',
    m: 'luna (y «mes»): la luna creciente se estiró en vertical y sus sombras quedaron como dos rayas',
    draw: <path d="M62 10 A40 40 0 1 0 62 90 A30 40 0 1 1 62 10 Z" />,
  },
  {
    h: '山',
    p: 'shān',
    m: 'montaña: tres picos',
    draw: <path d="M6 88 L28 42 L42 70 L52 18 L64 66 L78 40 L94 88 Z" />,
  },
  {
    h: '水',
    p: 'shuǐ',
    m: 'agua: una corriente con salpicaduras',
    draw: (
      <path d="M50 8 C44 30 56 50 50 70 C47 80 50 88 54 94 M30 30 Q22 44 14 50 M28 60 Q20 74 10 84 M70 28 Q78 40 88 48 M70 58 Q80 72 92 84" />
    ),
  },
  {
    h: '火',
    p: 'huǒ',
    m: 'fuego: una llama con chispas',
    draw: (
      <>
        <path d="M50 92 C24 90 18 64 34 44 C36 58 44 60 44 50 C44 34 56 24 52 8 C72 26 84 52 76 70 C72 84 62 92 50 92 Z" />
        <path d="M20 26 L24 34 M80 22 L76 32" />
      </>
    ),
  },
  {
    h: '雨',
    p: 'yǔ',
    m: 'lluvia: gotas cayendo bajo el cielo',
    draw: (
      <>
        <path d="M10 14 L90 14 M50 14 L50 30 M16 26 L16 80 M16 26 L84 26 L84 80" />
        <path d="M32 40 L32 50 M32 62 L32 72 M66 40 L66 50 M66 62 L66 72" />
      </>
    ),
  },
  {
    h: '木',
    p: 'mù',
    m: 'árbol: ramas arriba, raíces abajo',
    draw: <path d="M50 8 L50 92 M50 45 L22 22 M50 45 L78 22 M18 45 L82 45 M50 78 L28 94 M50 78 L72 94" />,
  },
  {
    h: '米',
    p: 'mǐ',
    m: 'arroz: granos alrededor de los tallos',
    draw: (
      <>
        <path d="M50 8 L50 92 M10 50 L90 50" />
        {dot(28, 28)}
        {dot(72, 28)}
        {dot(28, 72)}
        {dot(72, 72)}
      </>
    ),
  },
  {
    h: '田',
    p: 'tián',
    m: 'campo de cultivo dividido en parcelas',
    draw: <path d="M14 14 L86 14 L86 86 L14 86 Z M50 14 L50 86 M14 50 L86 50" />,
  },
  {
    h: '门',
    p: 'mén',
    m: 'puerta: dos hojas de una puerta (simplificado)',
    draw: <path d="M14 92 L14 12 L46 12 L46 92 M54 92 L54 12 L86 12 L86 92 M38 50 L40 50 M60 50 L62 50" />,
  },
  {
    h: '车',
    p: 'chē',
    m: 'carro visto desde arriba: caja, eje y dos ruedas',
    draw: <path d="M8 50 L92 50 M16 28 L16 72 M84 28 L84 72 M36 34 L64 34 L64 66 L36 66 Z" />,
  },
  {
    h: '马',
    p: 'mǎ',
    m: 'caballo: de perfil, con crin, patas y cola',
    draw: (
      <path d="M22 50 Q42 40 64 46 L78 20 L92 28 L78 50 L74 70 M28 52 L26 88 M40 54 L40 88 M62 56 L60 88 M72 66 L74 88 M78 20 L72 10 M70 30 L60 22 M22 50 Q10 60 12 76" />
    ),
  },
  {
    h: '鱼',
    p: 'yú',
    m: 'pez: cabeza, cuerpo con escamas y cola',
    draw: (
      <>
        <path d="M12 50 Q40 18 72 50 Q40 82 12 50 Z M72 50 L92 32 L92 68 Z M40 40 Q46 50 40 60 M52 40 Q58 50 52 60" />
        {dot(26, 46, 3)}
      </>
    ),
  },
]

const OLD: Record<string, ReactNode> = {
  日: <path d="M30 12 L70 12 Q78 12 78 20 L78 82 Q78 90 70 90 L30 90 Q22 90 22 82 L22 20 Q22 12 30 12 Z M22 51 L78 51" />,
  月: <path d="M30 10 L72 10 L72 88 L62 82 M30 10 Q30 70 16 92 M30 38 L72 38 M30 62 L72 62" />,
  口: <path d="M22 24 Q22 18 28 18 L72 18 Q78 18 78 24 L78 80 L22 80 Z" />,
  水: <path d="M50 8 L50 88 L42 82 M16 34 L40 34 L18 74 M82 26 L58 48 M58 48 L86 84" />,
  火: <path d="M50 10 L50 50 Q44 76 18 90 M50 50 Q58 76 84 90 M26 34 L32 50 M76 30 L68 48" />,
  雨: <path d="M14 14 L86 14 M50 14 L50 72 M18 30 L18 90 M18 30 L82 30 L82 90 L74 86 M30 44 L36 50 M30 62 L36 68 M62 44 L68 50 M62 62 L68 68" />,
  心: <path d="M14 60 L22 72 M30 40 Q30 86 54 86 Q76 86 76 72 M44 36 L52 46 M70 40 L82 56" />,
  女: <path d="M38 10 Q30 50 24 60 Q60 72 82 90 M66 28 Q60 70 22 92 M10 46 L90 46" />,
  子: <path d="M22 16 L76 16 L50 40 L50 86 Q50 94 40 88 M12 52 L88 52" />,
  目: <path d="M24 10 L76 10 L76 90 L24 90 Z M24 36 L76 36 M24 62 L76 62" />,
  手: <path d="M72 10 Q50 20 28 22 M20 42 L80 42 M14 64 L86 64 M50 22 L50 86 Q50 94 40 88" />,
  米: <path d="M50 8 L50 92 M10 50 L90 50 M28 22 L36 36 M72 22 L64 36 M50 50 L18 84 M50 50 L82 84" />,
  门: <path d="M20 12 L30 22 M20 32 L20 92 M36 16 L80 16 L80 88 L70 82" />,
  车: <path d="M14 26 L86 26 M44 10 L22 60 L82 60 M58 38 L58 92 M10 80 L90 80" />,
  马: <path d="M18 18 L72 18 L64 50 M30 18 L22 58 L82 58 L80 86 L70 82 M14 78 L60 78" />,
  鱼: <path d="M40 8 L22 30 M36 16 L66 16 L52 32 M24 34 L76 34 L76 70 L24 70 Z M50 34 L50 70 M24 52 L76 52 M14 88 L86 88" />,
}

export const PICTOS: Picto[] = BASE.map((p) => ({ ...p, old: OLD[p.h] }))

const BY_CHAR = new Map(PICTOS.map((p) => [p.h, p]))

/** Formas que adopta un pictograma cuando es una pieza de otro carácter */
const VARIANTS: Record<string, string> = { 亻: '人', 氵: '水', 灬: '火', 扌: '手', 忄: '心' }

export const getPicto = (char: string) => BY_CHAR.get(VARIANTS[char] ?? char)

/** Pictogramas presentes en una palabra: sus caracteres y sus piezas. `as` = forma en la que aparece. */
export function pictosInWord(word: Word): { picto: Picto; as: string }[] {
  const seen = new Set<string>()
  const out: { picto: Picto; as: string }[] = []
  for (const c of [...word.hanzi, ...word.radicals.map((r) => r.char)]) {
    const picto = getPicto(c)
    if (!picto || seen.has(picto.h)) continue
    seen.add(picto.h)
    out.push({ picto, as: c })
  }
  return out
}
