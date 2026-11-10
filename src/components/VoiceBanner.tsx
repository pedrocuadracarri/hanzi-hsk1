import { useZhVoice } from '../lib/speech'

export default function VoiceBanner() {
  const status = useZhVoice()
  if (status === 'unsupported') {
    return <div className="banner" role="status">Este navegador no permite reproducir voz. Prueba con Chrome o Safari.</div>
  }
  if (status === 'missing') {
    return (
      <div className="banner" role="status">
        <strong>No hay voz en chino (zh-CN) en este dispositivo.</strong> El audio puede sonar con acento
        incorrecto o no sonar. Instálala en: Android › Ajustes › Sistema › Idiomas › Salida de texto a voz ›
        Google › Instalar datos de voz › Chino. iPhone › Ajustes › Accesibilidad › Contenido leído › Voces ›
        Chino.
      </div>
    )
  }
  return null
}
