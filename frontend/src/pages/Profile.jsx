import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateMe } from '../api/auth'
import { getMyStories, deleteStory } from '../api/stories'

const PLACEHOLDER_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop&q=80'

const roleLabel = { reader: 'Lector', author: 'Autor', admin: 'Administrador' }
const statusLabel = { published: 'Publicado', draft: 'Borrador', suspended: 'Suspendido' }
const statusClass = { published: 'badge-published', draft: 'badge-draft', suspended: 'badge-suspended' }

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [stories, setStories] = useState([])
  const [loadingStories, setLoadingStories] = useState(true)

  useEffect(() => {
    getMyStories()
      .then(({ data }) => setStories(data.results || data))
      .finally(() => setLoadingStories(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateMe(form)
      updateUser(data)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta historia?')) return
    await deleteStory(id)
    setStories((prev) => prev.filter((s) => s.id !== id))
  }

  const initials = (user?.first_name?.[0] || user?.username?.[0] || '?').toUpperCase()

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>

      {/* ===== PROFILE HEADER ===== */}
      <div style={{ background: 'var(--navbar-bg)', paddingBottom: 0 }}>
        <div className="container" style={{ paddingTop: 36, paddingBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-indigo))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 700, color: '#fff',
              border: '3px solid rgba(255,255,255,0.2)',
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : initials
              }
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#fff', marginBottom: 3 }}>
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginBottom: 6 }}>@{user?.username}</p>
              <span style={{
                display: 'inline-block',
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem', fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)',
              }}>
                {roleLabel[user?.role] || 'Lector'}
              </span>
            </div>

            <button
              className="btn btn-ghost"
              onClick={() => setEditing((v) => !v)}
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)', padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {editing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>

          {/* Bio */}
          {user?.bio && !editing && (
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginTop: 16, maxWidth: 600 }}>
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            {[
              { v: stories.length, l: 'Obras' },
              { v: stories.reduce((a, s) => a + (s.views_count || 0), 0), l: 'Lecturas' },
              { v: stories.reduce((a, s) => a + (s.favorites_count || 0), 0), l: 'Favoritos' },
            ].map(({ v, l }) => (
              <div key={l}>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{v}</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        {/* Edit form */}
        {editing && (
          <div style={{
            padding: '28px', marginBottom: 24,
            background: '#fff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 20 }}>
              Editar perfil
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="form-input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <input className="form-input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Biografía</label>
                <textarea className="form-input" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Cuéntanos algo sobre ti..." style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '9px 22px' }}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)} style={{ padding: '9px 18px' }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {success && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--success)', fontSize: '0.85rem' }}>
            ✓ Perfil actualizado correctamente.
          </div>
        )}

        {/* ===== OBRAS ===== */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Obras <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>({stories.length})</span>
            </h2>
            <Link to="/create-story">
              <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.83rem' }}>
                + Nueva historia
              </button>
            </Link>
          </div>

          {/* Story list */}
          {loadingStories ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
          ) : stories.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>✍️</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 20 }}>Aún no has publicado ninguna historia.</p>
              <Link to="/create-story">
                <button className="btn btn-primary" style={{ padding: '10px 24px' }}>Crear mi primera historia</button>
              </Link>
            </div>
          ) : (
            stories.map((story, i) => (
              <div key={story.id} style={{
                display: 'flex', gap: 16, alignItems: 'center',
                padding: '16px 24px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
                transition: 'var(--transition-fast)',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Cover thumb */}
                <img
                  src={story.cover || PLACEHOLDER_COVER}
                  alt={story.title}
                  style={{ width: 52, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  onError={(e) => { e.target.src = PLACEHOLDER_COVER }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.97rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {story.title}
                    </h3>
                    <span className={`badge ${statusClass[story.status] || 'badge-draft'}`} style={{ fontSize: '0.67rem' }}>
                      {statusLabel[story.status]}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <span>⭐ {story.favorites_count || 0}</span>
                    <span>👁 {story.views_count || 0}</span>
                    <span>📖 {story.chapters_count || 0} cap.</span>
                    {story.genres?.slice(0, 2).map((g) => (
                      <span key={g.id} className="badge badge-genre" style={{ fontSize: '0.67rem' }}>{g.name}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Link to={`/edit-story/${story.id}`}>
                    <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>✏ Editar</button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => handleDelete(story.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
