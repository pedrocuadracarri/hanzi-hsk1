/** Trucos de estudio para quien empieza de cero. `to` enlaza a donde practicarlo. */
export interface Tip {
  text: string
  to?: string
  cta?: string
}

export const TIPS: Tip[] = [
  { text: 'Poco y a diario gana a mucho de golpe: 10 minutos cada día fijan más que una hora el domingo.' },
  { text: 'Di cada palabra en voz alta al oírla. Tu boca también tiene que aprender los tonos.' },
  { text: 'Los tonos cambian el significado: mā (mamá) y mǎ (caballo). Aprende cada palabra con su tono, no después.', to: '/tonos', cta: 'Entrenar tonos' },
  { text: 'Si un carácter se te resiste, mira sus piezas: 好 = 女 (mujer) + 子 (niño). Una historia con las piezas vale más que repetirlo 20 veces.', to: '/componentes', cta: 'Ver componentes' },
  { text: 'El chino no conjuga: 我去, 你去, 他去 → «voy», «vas», «va». El verbo nunca cambia.' },
  { text: 'Para preguntar sí/no, añade 吗 al final: 你是学生 → 你是学生吗？ (¿eres estudiante?)' },
  { text: 'El «cuándo» va antes del verbo: 我明天去 (yo mañana voy), nunca *我去明天.', to: '/frases', cta: 'Ordenar frases' },
  { text: 'Con adjetivos se usa 很 y no 是: 我很高兴 (estoy contento), no *我是高兴.' },
  { text: 'Entre número y cosa va un clasificador: 三个人 (tres personas), 一本书 (un libro). Si dudas, usa 个.' },
  { text: 'Fallar es parte del método: lo que fallas vuelve antes en el repaso. No hagas trampa en las tarjetas.' },
  { text: 'Escribir a mano (aunque sea con el dedo) ayuda a recordar el carácter. Prueba el modo dictado.', to: '/escribir', cta: 'Escribir' },
  { text: 'El 3.er tono seguido de otro 3.º se convierte en 2.º: 你好 se dice ní hǎo.', to: '/aprender/cambios', cta: 'Cambios de tono' },
  { text: '不 se pronuncia bú delante de un 4.º tono: 不是 = bú shì.' },
  { text: 'Los radicales dan pistas de significado: 氵(agua) en 没, 汉; 口 (boca) en 吃, 喝, 吗, 呢, 叫.' },
  { text: 'Lee las frases de ejemplo en voz alta imitando el audio: así aprendes ritmo y vocabulario a la vez.' },
  { text: 'No memorices listas: aprende palabras dentro de frases. «我想喝水» se recuerda mejor que «水» suelto.', to: '/frases', cta: 'Practicar frases' },
  { text: 'Repasa antes de aprender nuevas: si tienes pendientes, hazlas primero. El repaso es lo que convierte memoria corta en larga.', to: '/repaso', cta: 'Repaso mixto' },
  { text: 'Pon el pinyin como ayuda al principio, y quítalo en Ajustes cuando reconozcas los caracteres.', to: '/ajustes', cta: 'Ajustes' },
  { text: 'Para B1 (≈ HSK 3–4) necesitarás unas 1 000–1 200 palabras. HSK 1 son 150: ¡la base de todo lo demás!' },
  { text: 'Escucha primero sin leer: en los diálogos, dale a «Escuchar todo» antes de mirar el texto. Entrena el oído de verdad.', to: '/dialogos', cta: 'Diálogos' },
  { text: '¿No distingues un tono? Pulsa 🐢 Despacio: a media velocidad la curva del tono se oye mucho mejor.', to: '/tonos', cta: 'Tonos' },
  { text: 'Grábate diciendo la palabra y compárala con el modelo. Oírte a ti mismo es la forma más rápida de corregir la pronunciación.', to: '/dialogos', cta: 'Diálogos' },
  { text: 'Teclear el pinyin con números (ni3 hao3) te obliga a decidir el tono: es el mejor test de si de verdad lo sabes.', to: '/escribir-pinyin', cta: 'Escribir pinyin' },
  { text: 'Haz el simulacro cada pocas semanas: ver cómo sube tu nota motiva mucho.', to: '/examen', cta: 'Simulacro' },
  { text: 'Escucha chino aunque no lo entiendas (series, canciones, podcasts lentos). El oído se acostumbra a los tonos.' },
]

/** Truco fijo para cada día */
export function tipOfDay(today: string): number {
  const n = [...today].reduce((a, c) => a * 17 + c.charCodeAt(0), 3)
  return Math.abs(n) % TIPS.length
}
