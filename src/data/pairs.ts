/** Pares mínimos: sílabas que solo se distinguen por un sonido que al hispanohablante
 *  le cuesta oír. Se usan caracteres comunes y sin varias lecturas para que la voz acierte. */
export interface PairSide {
  hanzi: string
  pinyin: string
  meaning: string
}

export interface PairGroup {
  id: string
  label: string
  tip: string
  pairs: [PairSide, PairSide][]
}

const s = (hanzi: string, pinyin: string, meaning: string): PairSide => ({ hanzi, pinyin, meaning })

export const PAIR_GROUPS: PairGroup[] = [
  {
    id: 'zh-z',
    label: 'zh / z',
    tip: 'zh: punta de la lengua doblada hacia atrás. z: punta detrás de los dientes, como «ds» en «adsorber».',
    pairs: [
      [s('知', 'zhī', 'saber'), s('资', 'zī', 'recursos')],
      [s('主', 'zhǔ', 'dueño'), s('祖', 'zǔ', 'ancestro')],
      [s('站', 'zhàn', 'estación'), s('赞', 'zàn', 'alabar')],
    ],
  },
  {
    id: 'ch-c',
    label: 'ch / c',
    tip: 'ch: lengua doblada atrás y con soplo. c: como «ts» de «tsunami», con soplo fuerte.',
    pairs: [
      [s('出', 'chū', 'salir'), s('粗', 'cū', 'grueso')],
      [s('成', 'chéng', 'convertirse'), s('层', 'céng', 'piso, capa')],
      [s('吵', 'chǎo', 'ruidoso'), s('草', 'cǎo', 'hierba')],
    ],
  },
  {
    id: 'sh-s',
    label: 'sh / s',
    tip: 'sh: lengua doblada atrás, suena «oscura». s: como la «s» española, clara.',
    pairs: [
      [s('是', 'shì', 'ser'), s('四', 'sì', 'cuatro')],
      [s('山', 'shān', 'montaña'), s('三', 'sān', 'tres')],
      [s('书', 'shū', 'libro'), s('酥', 'sū', 'crujiente')],
    ],
  },
  {
    id: 'q-ch',
    label: 'q / ch',
    tip: 'q: lengua plana abajo y sonrisa, como «ch» muy suave. ch: lengua doblada hacia atrás.',
    pairs: [
      [s('七', 'qī', 'siete'), s('吃', 'chī', 'comer')],
      [s('气', 'qì', 'aire'), s('赤', 'chì', 'rojo')],
      [s('钱', 'qián', 'dinero'), s('缠', 'chán', 'enredar')],
    ],
  },
  {
    id: 'x-sh',
    label: 'x / sh',
    tip: 'x: sonrisa y lengua plana, entre «s» y «sh». sh: lengua doblada hacia atrás.',
    pairs: [
      [s('西', 'xī', 'oeste'), s('师', 'shī', 'maestro')],
      [s('洗', 'xǐ', 'lavar'), s('使', 'shǐ', 'usar')],
      [s('小', 'xiǎo', 'pequeño'), s('少', 'shǎo', 'poco')],
    ],
  },
  {
    id: 'j-zh',
    label: 'j / zh',
    tip: 'j: como «y» de «yo» con fuerza, lengua plana. zh: lengua doblada hacia atrás.',
    pairs: [
      [s('鸡', 'jī', 'pollo'), s('汁', 'zhī', 'zumo')],
      [s('举', 'jǔ', 'levantar'), s('主', 'zhǔ', 'dueño')],
      [s('见', 'jiàn', 'ver'), s('站', 'zhàn', 'estación')],
    ],
  },
  {
    id: 'u-ü',
    label: 'u / ü',
    tip: 'ü: di «i» con los labios redondos, como la «u» francesa. u: la «u» de siempre.',
    pairs: [
      [s('女', 'nǚ', 'mujer'), s('努', 'nǔ', 'esforzarse')],
      [s('绿', 'lǜ', 'verde'), s('路', 'lù', 'camino')],
      [s('旅', 'lǚ', 'viajar'), s('鲁', 'lǔ', 'Lu (apellido)')],
    ],
  },
  {
    id: 'i-ü',
    label: 'i / ü',
    tip: 'Misma lengua; cambia solo la boca: i con sonrisa, ü con labios redondos.',
    pairs: [
      [s('你', 'nǐ', 'tú'), s('女', 'nǚ', 'mujer')],
      [s('李', 'lǐ', 'ciruela'), s('旅', 'lǚ', 'viajar')],
      [s('姨', 'yí', 'tía'), s('鱼', 'yú', 'pez')],
    ],
  },
  {
    id: 'an-ang',
    label: 'an / ang',
    tip: '-n: la lengua toca detrás de los dientes. -ng: la lengua se queda atrás, como en «tango».',
    pairs: [
      [s('三', 'sān', 'tres'), s('桑', 'sāng', 'morera')],
      [s('饭', 'fàn', 'comida'), s('放', 'fàng', 'poner')],
      [s('山', 'shān', 'montaña'), s('商', 'shāng', 'comercio')],
    ],
  },
  {
    id: 'en-eng',
    label: 'en / eng',
    tip: '-en termina con la lengua delante; -eng termina atrás y suena más «hueco».',
    pairs: [
      [s('门', 'mén', 'puerta'), s('盟', 'méng', 'alianza')],
      [s('分', 'fēn', 'minuto'), s('风', 'fēng', 'viento')],
      [s('根', 'gēn', 'raíz'), s('耕', 'gēng', 'arar')],
    ],
  },
  {
    id: 'in-ing',
    label: 'in / ing',
    tip: '-in corta y cerrada; -ing termina atrás, como en inglés «sing».',
    pairs: [
      [s('今', 'jīn', 'hoy'), s('京', 'jīng', 'capital')],
      [s('心', 'xīn', 'corazón'), s('星', 'xīng', 'estrella')],
      [s('民', 'mín', 'pueblo'), s('名', 'míng', 'nombre')],
    ],
  },
  {
    id: 'soplo',
    label: 'b/p · d/t · g/k · z/c',
    tip: 'b, d, g, z van sin aire (casi como p, t, k, ts suaves). p, t, k, c llevan un soplo fuerte: pon la mano delante de la boca.',
    pairs: [
      [s('爸', 'bà', 'papá'), s('怕', 'pà', 'tener miedo')],
      [s('肚', 'dù', 'barriga'), s('兔', 'tù', 'conejo')],
      [s('哥', 'gē', 'hermano mayor'), s('科', 'kē', 'asignatura')],
      [s('再', 'zài', 'otra vez'), s('菜', 'cài', 'plato')],
    ],
  },
]
