import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_CHARS } from '../data'
import { updateSettings, useSettings } from '../lib/settings'
import { speak, useZhVoice } from '../lib/speech'
import { countCachedStrokes, downloadAllStrokes } from '../lib/strokes'
import { exportSnapshot, importSnapshot, resetProgress } from '../lib/storage'
import { isSnapshot } from '../lib/snapshot'
import { getSyncConfig, setSyncConfig, syncNow } from '../lib/sync'

function OfflineSection() {
  const [cached, setCached] = useState<number | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    countCachedStrokes(ALL_CHARS).then(setCached)
  }, [])

  const download = async () => {
    setMsg('')
    setBusy(0)
    const { failed } = await downloadAllStrokes(ALL_CHARS, setBusy)
    setBusy(null)
    setCached(await countCachedStrokes(ALL_CHARS))
    setMsg(failed ? `${failed} caracteres no se pudieron descargar. Revisa la conexión e inténtalo otra vez.` : '¡Listo! Ya puedes usar la app sin conexión.')
  }

  const total = ALL_CHARS.length
  return (
    <section className="card settings-section">
      <h2 className="section-title">📶 Usar sin conexión</h2>
      <p className="muted small-left">
        La app ya funciona offline. Los trazos de los caracteres se descargan al verlos; aquí puedes bajarlos todos de una
        vez (~{Math.round(total * 1.5)} KB).
      </p>
      <div className="bar" aria-hidden>
        <div className="bar-fill" style={{ width: `${((busy ?? cached ?? 0) / total) * 100}%` }} />
      </div>
      <p className="small-left">
        {busy !== null ? `Descargando… ${busy}/${total}` : `${cached ?? '…'} de ${total} caracteres guardados`}
      </p>
      <button className="btn" onClick={download} disabled={busy !== null || cached === total}>
        {cached === total ? '✓ Todo descargado' : 'Descargar todos los trazos'}
      </button>
      {msg && <p className="small-left">{msg}</p>}
    </section>
  )
}

function SyncSection() {
  const [cfg, setCfg] = useState(getSyncConfig)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const run = async () => {
    setBusy(true)
    setStatus('Sincronizando…')
    try {
      await syncNow()
      setCfg(getSyncConfig())
      setStatus('✓ Sincronizado')
    } catch (e) {
      setStatus('⚠️ ' + (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const connect = async () => {
    setSyncConfig({ token: token.trim() })
    setToken('')
    await run()
    if (!getSyncConfig()?.gistId) setSyncConfig(null)
    setCfg(getSyncConfig())
  }

  const disconnect = () => {
    setSyncConfig(null)
    setCfg(null)
    setStatus('Desconectado. Tu progreso sigue guardado en este dispositivo.')
  }

  const exportFile = async () => {
    const snap = await exportSnapshot()
    const blob = new Blob([JSON.stringify(snap, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `hanzi-progreso-${snap.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      if (!isSnapshot(data)) throw new Error()
      await importSnapshot(data)
      setStatus(`✓ Importado y combinado (${data.progress.length} palabras en el archivo).`)
    } catch {
      setStatus('⚠️ Ese archivo no es una copia válida de esta app.')
    }
  }

  return (
    <section className="card settings-section">
      <h2 className="section-title">🔄 Sincronizar móvil y PC</h2>
      {cfg?.gistId ? (
        <>
          <p className="small-left">
            ✓ Conectado. Se sincroniza solo al abrir y al cerrar la app.
            {cfg.lastSync && ` Última vez: ${new Date(cfg.lastSync).toLocaleString('es')}.`}
          </p>
          <div className="rate-row">
            <button className="btn" onClick={run} disabled={busy}>
              Sincronizar ahora
            </button>
            <button className="btn" onClick={disconnect}>
              Desconectar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="muted small-left">
            Tu progreso se guarda en cada dispositivo. Para compartirlo entre el móvil y el PC, usa un <em>Gist</em>{' '}
            privado de GitHub (gratis):
          </p>
          <ol className="bullets small-left">
            <li>
              Entra en{' '}
              <a href="https://github.com/settings/tokens/new?scopes=gist&description=Hanzi%20HSK%201" target="_blank" rel="noreferrer">
                github.com › crear token
              </a>{' '}
              (ya viene marcado solo el permiso <strong>gist</strong>). Elige caducidad «No expiration» y pulsa «Generate token».
            </li>
            <li>Copia el token y pégalo aquí. Haz lo mismo en el otro dispositivo con el mismo token.</li>
          </ol>
          <input
            className="search"
            type="password"
            autoComplete="off"
            placeholder="ghp_…"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="btn btn-primary" onClick={connect} disabled={!token.trim() || busy}>
            Conectar
          </button>
          <p className="muted small-left">El token se guarda solo en este dispositivo y únicamente da acceso a tus gists.</p>
        </>
      )}
      <h3 className="section-title">Copia manual</h3>
      <p className="muted small-left">También puedes pasar un archivo de un dispositivo a otro. Al importar se combina con lo que ya tienes, sin perder nada.</p>
      <div className="rate-row">
        <button className="btn" onClick={exportFile}>
          ⬇️ Exportar
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          ⬆️ Importar
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])}
      />
      {status && <p className="small-left">{status}</p>}
    </section>
  )
}

export default function Settings() {
  const s = useSettings()
  const voice = useZhVoice()

  const reset = async () => {
    if (!confirm('¿Borrar todo el progreso de este dispositivo? No se puede deshacer.')) return
    await resetProgress()
    alert('Progreso borrado.')
  }

  return (
    <main className="screen">
      <Link to="/" className="back">
        ← Inicio
      </Link>
      <h1 className="title">Ajustes</h1>

      <section className="card settings-section">
        <h2 className="section-title">🔊 Voz</h2>
        <p className="small-left">
          {voice === 'ok' && '✓ Voz en chino disponible.'}
          {voice === 'missing' && '⚠️ No hay voz en chino instalada en este dispositivo.'}
          {voice === 'unsupported' && '⚠️ Este navegador no permite voz.'}
          {voice === 'checking' && 'Comprobando voz…'}
        </p>
        <label className="field">
          <span>Velocidad: {s.rate.toFixed(1)}×</span>
          <input
            type="range"
            min={0.5}
            max={1.1}
            step={0.1}
            value={s.rate}
            onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
          />
        </label>
        <button className="btn" onClick={() => speak('你好，我是你的老师。')}>
          Probar voz
        </button>
        <label className="toggle">
          <input type="checkbox" checked={s.autoplay} onChange={(e) => updateSettings({ autoplay: e.target.checked })} />
          <span>Reproducir audio automáticamente</span>
        </label>
      </section>

      <section className="card settings-section">
        <h2 className="section-title">🎨 Apariencia</h2>
        <div className="segmented" role="radiogroup" aria-label="Tema">
          {(
            [
              ['auto', 'Sistema'],
              ['light', '☀️ Claro'],
              ['dark', '🌙 Oscuro'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="radio"
              aria-checked={s.theme === id}
              className={s.theme === id ? 'active' : ''}
              onClick={() => updateSettings({ theme: id })}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card settings-section">
        <h2 className="section-title">🎓 Aprendizaje</h2>
        <label className="toggle">
          <input type="checkbox" checked={s.pinyinHint} onChange={(e) => updateSettings({ pinyinHint: e.target.checked })} />
          <span>Mostrar pinyin como ayuda bajo los caracteres</span>
        </label>
        <p className="muted small-left">Muy útil al principio. Quítalo cuando quieras retarte.</p>
        <div className="field">
          <span>Objetivo diario</span>
          <div className="segmented">
            {[10, 20, 40, 60].map((n) => (
              <button key={n} className={s.dailyGoal === n ? 'active' : ''} onClick={() => updateSettings({ dailyGoal: n })}>
                {n}
              </button>
            ))}
          </div>
          <small className="muted">respuestas al día</small>
        </div>
      </section>

      <SyncSection />
      <OfflineSection />

      <section className="card settings-section">
        <h2 className="section-title">📲 Instalar la app</h2>
        <p className="small-left">
          <strong>Android (Chrome):</strong> menú ⋮ › «Instalar aplicación» o «Añadir a pantalla de inicio».
        </p>
        <p className="small-left">
          <strong>iPhone (Safari):</strong> botón Compartir › «Añadir a pantalla de inicio».
        </p>
        <p className="small-left">
          <strong>PC (Chrome/Edge):</strong> icono de instalar ⊕ en la barra de direcciones.
        </p>
      </section>

      <button className="btn btn-bad" onClick={reset}>
        Borrar progreso de este dispositivo
      </button>
    </main>
  )
}
