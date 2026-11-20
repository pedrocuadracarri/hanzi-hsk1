import { NavLink, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/', icon: '🏠', label: 'Inicio', match: ['/unidad/'] as string[] },
  { to: '/aprender', icon: '🎓', label: 'Aprender', match: ['/dialogos'] },
  { to: '/practicar', icon: '🧩', label: 'Practicar', match: ['/repaso', '/examen', '/frases', '/escribir-pinyin', '/emparejar', '/tarjetas', '/escuchar', '/escribir', '/tonos', '/pares', '/dibujos'] },
  { to: '/palabras', icon: '📖', label: 'Palabras', match: ['/palabra/', '/componentes'] },
  { to: '/progreso', icon: '📈', label: 'Progreso', match: [] },
]

export default function TabBar() {
  const path = useLocation().pathname
  return (
    <nav className="tabbar" aria-label="Navegación principal">
      <div className="tabbar-inner">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => (isActive || t.match.some((m) => path.startsWith(m)) ? 'active' : '')}
          >
            <span className="tab-icon" aria-hidden>
              {t.icon}
            </span>
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
