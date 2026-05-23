import { Link, useLocation, Outlet } from 'react-router-dom'

const menu = [
  { to: '/panel', label: 'Dashboard', icon: '◎' },
  { to: '/panel/users', label: 'Usuarios', icon: '👥' },
  { to: '/panel/stories', label: 'Historias', icon: '📚' },
  { to: '/panel/categories', label: 'Géneros', icon: '🏷' },
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
        {menu.map(({ to, label, icon }) => {
          const active = to === '/panel' ? location.pathname === '/panel' : location.pathname.startsWith(to) && to !== '/panel'
          return (
            <Link key={to} to={to}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 20px', margin: '2px 8px',
                borderRadius: 'var(--radius-md)',
                background: active ? 'rgba(74,144,226,0.12)' : 'transparent',
                borderLeft: active ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                transition: 'var(--transition-fast)',
                fontSize: '0.9rem',
              }}>
                <span>{icon}</span>
                <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
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
