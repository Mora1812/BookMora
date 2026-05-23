import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyStories, deleteStory } from '../api/stories'
import LoadingSpinner from '../components/LoadingSpinner'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop&q=80'
const statusClass = { published: 'badge-published', draft: 'badge-draft', suspended: 'badge-suspended' }
const statusLabel = { published: 'Publicado', draft: 'Borrador', suspended: 'Suspendido' }

export default function MyStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyStories().then(({ data }) => setStories(data.results || data)).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta historia permanentemente?')) return
    await deleteStory(id)
    setStories((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 3 }}>Mis Historias</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stories.length} historia{stories.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/create-story">
            <button className="btn btn-primary" style={{ padding: '9px 20px' }}>+ Nueva historia</button>
          </Link>
        </div>

        {loading ? <LoadingSpinner /> : stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 14 }}>✍️</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.97rem', marginBottom: 22 }}>Aún no has publicado ninguna historia.</p>
            <Link to="/create-story">
              <button className="btn btn-primary" style={{ padding: '11px 26px' }}>Crear mi primera historia</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stories.map((story) => (
              <div key={story.id} style={{
                display: 'flex', gap: 18, alignItems: 'center',
                padding: '16px 20px', background: '#fff',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)', transition: 'var(--transition)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
              >
                <img
                  src={story.cover || PLACEHOLDER}
                  alt={story.title}
                  style={{ width: 56, height: 76, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{story.title}</h3>
                    <span className={`badge ${statusClass[story.status] || 'badge-draft'}`} style={{ fontSize: '0.68rem' }}>
                      {statusLabel[story.status]}
                    </span>
                    {story.is_featured && <span className="badge badge-genre" style={{ fontSize: '0.68rem' }}>Destacado</span>}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {story.description}
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span>📖 {story.chapters_count} cap.</span>
                    <span>👁 {story.views_count}</span>
                    <span>❤ {story.favorites_count}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link to={`/stories/${story.id}`}>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Ver</button>
                  </Link>
                  <Link to={`/edit-story/${story.id}`}>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>✏ Editar</button>
                  </Link>
                  <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '0.78rem' }} onClick={() => handleDelete(story.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
