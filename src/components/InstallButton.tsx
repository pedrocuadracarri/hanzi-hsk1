import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

/** Botón «Instalar app» cuando el navegador lo permite (Chrome, Edge, Android) */
export default function InstallButton() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setEvt(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!evt) return null
  return (
    <button
      className="btn install-btn"
      onClick={async () => {
        await evt.prompt()
        setEvt(null)
      }}
    >
      📲 Instalar la app en este dispositivo
    </button>
  )
}
