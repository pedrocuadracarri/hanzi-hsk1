import { useState } from 'react'
import { useZhVoice } from '../lib/speech'

const KEY = 'hanzi-voice-banner-hidden'

function isHidden() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function VoiceBanner() {
  const status = useZhVoice()
  const [hidden, setHidden] = useState(isHidden)
  if (hidden || (status !== 'missing' && status !== 'unsupported')) return null

  const hide = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* sin almacenamiento */
    }
    setHidden(true)
  }

  return (
    <div className="banner banner-compact" role="status">
      <details>
        <summary>
          {status === 'unsupported'
            ? '⚠️ Este navegador no reproduce voz. Prueba con Chrome o Safari.'
            : '⚠️ No hay voz china instalada: el audio puede sonar mal.'}{' '}
          <u>Cómo arreglarlo</u>
        </summary>
        <p>
          <strong>Android:</strong> Ajustes › Sistema › Idiomas › Salida de texto a voz › Google › Instalar datos de voz ›
          Chino (mandarín).
        </p>
        <p>
          <strong>iPhone:</strong> Ajustes › Accesibilidad › Contenido leído › Voces › Chino.
        </p>
        <p>
          <strong>Windows:</strong> Configuración › Hora e idioma › Voz › Agregar voces › Chino (simplificado). Luego
          reinicia el navegador.
        </p>
      </details>
      <button className="banner-close" onClick={hide} aria-label="Ocultar aviso">
        ✕
      </button>
    </div>
  )
}
