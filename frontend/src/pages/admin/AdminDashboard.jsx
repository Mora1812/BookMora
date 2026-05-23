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
    { label: 'Usuarios registrados', value: stats?.totalUsers, icon: '👥', color: 'var(--accent-primary)' },
    { label: 'Historias publicadas', value: stats?.totalStories, icon: '📚', color: 'var(--accent-indigo)' },
    { label: 'Géneros activos', value: '—', icon: '🏷', color: 'var(--accent-purple)' },
    { label: 'Lecturas totales', value: '—', icon: '👁', color: 'var(--success)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Resumen general de BookMora</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {statCards.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            padding: '24px', background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            </div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {value ?? '—'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</p>
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
