import { useState, useEffect } from 'react'
import { getAdminUsers, toggleSuspendUser, changeUserRole, deleteAdminUser } from '../../api/auth'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (roleFilter) params.role = roleFilter
    getAdminUsers(params)
      .then(({ data }) => setUsers(data.results || data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [search, roleFilter])

  const handleSuspend = async (id) => {
    await toggleSuspendUser(id)
    fetchUsers()
  }

  const handleRole = async (id, role) => {
    await changeUserRole(id, role)
    fetchUsers()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este usuario permanentemente?')) return
    await deleteAdminUser(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Usuarios</h1>
        <p style={{ color: 'var(--text-muted)' }}>Gestiona todos los usuarios de la plataforma</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 300 }} placeholder="Buscar usuario..." value={search}
          onChange={(e) => { clearTimeout(window._st); window._st = setTimeout(() => setSearch(e.target.value), 400) }} />
        <select className="form-input" style={{ maxWidth: 160 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="reader">Lectores</option>
          <option value="author">Autores</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Usuario', 'Email', 'Rol', 'Estado', 'Historias', 'Acciones'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-indigo))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>
                        {u.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{u.username}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.first_name} {u.last_name}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRole(u.id, e.target.value)}
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      <option value="reader">Lector</option>
                      <option value="author">Autor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${u.is_suspended ? 'badge-suspended' : 'badge-published'}`}>
                      {u.is_suspended ? 'Suspendido' : 'Activo'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.stories_count}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className={`btn ${u.is_suspended ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        onClick={() => handleSuspend(u.id)}
                      >
                        {u.is_suspended ? 'Activar' : 'Suspender'}
                      </button>
                      <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No se encontraron usuarios.</p>
          )}
        </div>
      )}
    </div>
  )
}
