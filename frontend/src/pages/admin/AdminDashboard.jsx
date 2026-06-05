import { useState, useEffect } from 'react'
import { getAdminUsers } from '../../api/auth'
import { getStories } from '../../api/stories'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentStories, setRecentStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAdminUsers({ page_size: 1 }),
      getStories({ page_size: 6, ordering: '-created_at' }),
    ])
      .then(([usersRes, storiesRes]) => {
        setStats({
          totalUsers: usersRes.data.count || 0,
          totalStories: storiesRes.data.count || 0,
        })
        setRecentStories(storiesRes.data.results || storiesRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const statCards = [
    {
      label: 'Usuarios registrados', value: stats?.totalUsers,
      color: '#2563EB', bg: 'rgba(37,99,235,0.12)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: 'Historias publicadas', value: stats?.totalStories,
      color: '#7C3AED', bg: 'rgba(124,58,237,0.12)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    },
    {
      label: 'Géneros activos', value: '—',
      color: '#0891B2', bg: 'rgba(8,145,178,0.12)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7.01" y2="7"/>
        </svg>
      ),
    },
    {
      label: 'Lecturas totales', value: '—',
      color: '#059669', bg: 'rgba(5,150,105,0.12)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Resumen general de BookMora</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map(({ label, value, icon, color, bg }) => (
          <div key={label} style={{
            padding: '24px', background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: bg, color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {icon}
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 4 }} />
            </div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {value ?? '—'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Recent stories */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Historias recientes</h2>
          <Link to="/panel/stories" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>Ver todas →</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Título', 'Autor', 'Estado', 'Vistas'].map((h) => (
                <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentStories.map((s) => (
              <tr key={s.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 24px' }}>
                  <Link to={`/stories/${s.id}`} style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{s.title}</Link>
                </td>
                <td style={{ padding: '14px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.author?.username}</td>
                <td style={{ padding: '14px 24px' }}>
                  <span className={`badge badge-${s.status}`}>{s.status}</span>
                </td>
                <td style={{ padding: '14px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.views_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
