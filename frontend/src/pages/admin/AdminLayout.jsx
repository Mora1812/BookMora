import { Link, useLocation, Outlet } from 'react-router-dom'

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconStories = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const IconGenres = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const menu = [
  { to: '/panel', label: 'Dashboard', Icon: IconDashboard },
  { to: '/panel/users', label: 'Usuarios', Icon: IconUsers },
  { to: '/panel/stories', label: 'Historias', Icon: IconStories },
  { to: '/panel/categories', label: 'Géneros', Icon: IconGenres },
]

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '32px 0',
        position: 'fixed',
        top: 'var(--nav-height)', bottom: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Panel de Admin
          </p>
        </div>
        {menu.map(({ to, label, Icon }) => {
          const active = to === '/panel' ? location.pathname === '/panel' : location.pathname.startsWith(to) && to !== '/panel'
          return (
            <Link key={to} to={to}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 20px', margin: '2px 8px',
                borderRadius: 'var(--radius-md)',
                background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                borderLeft: active ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-fast)',
                fontSize: '0.9rem',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon />
                <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            </Link>
          )
        })}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, padding: '40px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
