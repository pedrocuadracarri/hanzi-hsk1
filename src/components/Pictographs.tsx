import { useState, type ReactNode } from 'react'
import SpeakerButton from './SpeakerButton'

/** Dibujos sencillos del objeto que originó cada carácter (viewBox 0 0 100 100) */
const PICTOS: { h: string; p: string; m: string; draw: ReactNode }[] = [
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
    h: '木',
    p: 'mù',
    m: 'árbol: ramas arriba, raíces abajo',
    draw: <path d="M50 8 L50 92 M50 45 L22 22 M50 45 L78 22 M18 45 L82 45 M50 78 L28 94 M50 78 L72 94" />,
  },
  {
    h: '日',
    p: 'rì',
    m: 'sol (y «día»): un círculo con un punto',
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
    m: 'luna (y «mes»): la luna creciente',
    draw: <path d="M62 10 A40 40 0 1 0 62 90 A30 40 0 1 1 62 10 Z" />,
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
    h: '门',
    p: 'mén',
    m: 'puerta: dos hojas de una puerta (simplificado)',
    draw: <path d="M14 92 L14 12 L46 12 L46 92 M54 92 L54 12 L86 12 L86 92 M38 50 L40 50 M60 50 L62 50" />,
  },
]

function Picto({ h, p, m, draw }: (typeof PICTOS)[number]) {
  const [v, setV] = useState(0)
  return (
    <div className="picto card">
      <button
        className="picto-stage"
        onClick={() => setV(v < 0.5 ? 1 : 0)}
        aria-label={`Transformar el dibujo en ${h}`}
      >
        <svg viewBox="0 0 100 100" className="picto-draw" style={{ opacity: 1 - v }} aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
            {draw}
          </g>
        </svg>
        <span className="hanzi picto-hanzi" style={{ opacity: v }}>
          {h}
        </span>
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        aria-label={`Del dibujo al carácter ${h}`}
      />
      <div className="picto-info">
        <strong>
          <span className="hanzi">{h}</span> {p}
        </strong>
        <SpeakerButton text={h} />
      </div>
      <small className="muted">{m}</small>
    </div>
  )
}

/** Galería interactiva: del dibujo al carácter (toca o desliza) */
export default function Pictographs() {
  return (
    <div className="picto-grid">
      {PICTOS.map((x) => (
        <Picto key={x.h} {...x} />
      ))}
    </div>
  )
}
