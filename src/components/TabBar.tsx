import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/', icon: '🏠', label: 'Inicio' },
  { to: '/emparejar', icon: '🧩', label: 'Practicar' },
  { to: '/palabras', icon: '📖', label: 'Palabras' },
  { to: '/componentes', icon: '🧱', label: 'Componentes' },
  { to: '/progreso', icon: '📈', label: 'Progreso' },
]

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Navegación principal">
      <div className="tabbar-inner">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'}>
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
