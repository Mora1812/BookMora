import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStories, toggleFeatured, changeStoryStatus, deleteStory } from '../../api/stories'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchStories = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (statusFilter) params.status = statusFilter
    getStories(params)
      .then(({ data }) => setStories(data.results || data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStories() }, [search, statusFilter])

  const handleFeatured = async (id) => {
    await toggleFeatured(id)
    fetchStories()
  }

  const handleStatus = async (id, status) => {
    await changeStoryStatus(id, status)
    fetchStories()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta historia?')) return
    await deleteStory(id)
    setStories((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Historias</h1>
        <p style={{ color: 'var(--text-muted)' }}>Modera y gestiona todo el contenido de la plataforma</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ maxWidth: 300 }} placeholder="Buscar historias..." onChange={(e) => { clearTimeout(window._st2); window._st2 = setTimeout(() => setSearch(e.target.value), 400) }} />
        <select className="form-input" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
          <option value="suspended">Suspendidos</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Historia', 'Autor', 'Estado', 'Vistas', 'Destacado', 'Acciones'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px 16px', maxWidth: 220 }}>
                    <Link to={`/stories/${s.id}`} style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {s.title}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.author?.username}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={s.status}
                      onChange={(e) => handleStatus(s.id, e.target.value)}
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      <option value="published">Publicado</option>
                      <option value="draft">Borrador</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.views_count}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleFeatured(s.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: s.is_featured ? 1 : 0.3, transition: 'var(--transition-fast)' }}
                      title={s.is_featured ? 'Quitar destacado' : 'Marcar destacado'}
                    >
                      ⭐
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link to={`/edit-story/${s.id}`}>
                        <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>Editar</button>
                      </Link>
                      <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => handleDelete(s.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stories.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No se encontraron historias.</p>
          )}
        </div>
      )}
    </div>
  )
}
