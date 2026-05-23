import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStory, deleteStory } from '../api/stories'
import { toggleFavorite, checkFavorite } from '../api/favorites'
import { getComments, createComment, deleteComment } from '../api/comments'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&q=80'

export default function StoryDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('descripcion')

  useEffect(() => {
    Promise.all([
      getStory(id),
      getComments(id),
      user ? checkFavorite(id) : Promise.resolve({ data: { is_favorite: false } }),
    ])
      .then(([stRes, cmRes, favRes]) => {
        setStory(stRes.data)
        setComments(cmRes.data.results || cmRes.data)
        setIsFav(favRes.data.is_favorite)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id, user])

  const handleFavorite = async () => {
    if (!user) { navigate('/login'); return }
    const { data } = await toggleFavorite(id)
    setIsFav(data.is_favorite)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const { data } = await createComment({ story: id, content: newComment })
      setComments((prev) => [data, ...prev])
      setNewComment('')
    } catch {}
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta historia permanentemente?')) return
    await deleteStory(id)
    navigate('/my-stories')
  }

  if (loading) return <div className="page-content"><LoadingSpinner text="Cargando historia..." /></div>
  if (!story)  return <div className="page-content"><div className="container"><p>Historia no encontrada.</p></div></div>

  const isOwner = user?.id === story.author?.id
  const isAdmin = user?.role === 'admin'
  const cover = story.cover || PLACEHOLDER

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>

          {/* ===== MAIN ===== */}
          <div>
            {/* Title row */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: 24 }}>
              {/* Cover */}
              <img
                src={cover}
                alt={story.title}
                style={{ width: 130, flexShrink: 0, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card-hover)', objectFit: 'cover', aspectRatio: '2/3' }}
                onError={(e) => { e.target.src = PLACEHOLDER }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {story.genres?.map((g) => <span key={g.id} className="badge badge-genre">{g.name}</span>)}
                  <span className={`badge badge-${story.status}`}>{story.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
                  {story.title}
                </h1>
                {/* Author */}
                <Link to={`/authors/${story.author?.username}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-indigo))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                  }}>
                    {story.author?.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>{story.author?.first_name || story.author?.username}</p>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>Autor</p>
                  </div>
                </Link>
                {/* Stats */}
                <div style={{ display: 'flex', gap: 18, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>👁 {story.views_count}</span>
                  <span>❤ {story.favorites_count}</span>
                  <span>📖 {story.chapters_count} cap.</span>
                  <span>💬 {story.comments_count}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border-subtle)', marginBottom: 24 }}>
              {[{ id: 'descripcion', label: 'Descripción' }, { id: 'contenido', label: 'Tabla de contenido' }].map((t) => (
                <button key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '9px 20px', fontSize: '0.88rem',
                    fontWeight: activeTab === t.id ? 600 : 400,
                    color: activeTab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                    borderBottom: activeTab === t.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    marginBottom: '-2px', background: 'none', border: 'none',
                    cursor: 'pointer', transition: 'var(--transition-fast)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Description tab */}
            {activeTab === 'descripcion' && (
              <div>
                <p style={{ fontSize: '0.97rem', color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 32 }}>
                  {story.description}
                </p>

                {/* Comments */}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 18 }}>
                  Comentarios ({comments.length})
                </h3>
                {user && (
                  <form onSubmit={handleComment} style={{ marginBottom: 20 }}>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Escribe un comentario..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      style={{ resize: 'vertical', marginBottom: 10 }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '8px 20px' }}>
                      {submitting ? 'Publicando...' : 'Publicar comentario'}
                    </button>
                  </form>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {comments.map((c) => (
                    <div key={c.id} style={{ padding: '14px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text-primary)' }}>{c.user?.username}</p>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString('es-CR')}</p>
                          {(user?.id === c.user?.id || isAdmin) && (
                            <button onClick={() => { deleteComment(c.id); setComments((prev) => prev.filter((x) => x.id !== c.id)) }} style={{ color: 'var(--error)', fontSize: '0.73rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65 }}>{c.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                      Sé el primero en comentar.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Chapters tab */}
            {activeTab === 'contenido' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {story.chapters?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>Aún no hay capítulos publicados.</p>
                ) : story.chapters?.map((ch, i) => (
                  <Link key={ch.id} to={`/stories/${id}/read/${ch.id}`}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                      transition: 'var(--transition)',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--accent-light)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                    >
                      <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <p style={{ flex: 1, fontSize: '0.92rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                        Parte {i + 1}: {ch.title}
                      </p>
                      <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem' }}>Leer →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ===== SIDEBAR ===== */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 34px + 16px)' }}>
            {story.chapters?.length > 0 && (
              <Link to={`/stories/${id}/read/${story.chapters[0]?.id}`}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginBottom: 10 }}>
                  Seguir / Leer
                </button>
              </Link>
            )}
            <button
              onClick={handleFavorite}
              style={{
                width: '100%', padding: '11px', justifyContent: 'center', marginBottom: 20,
                borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontWeight: 500,
                background: isFav ? 'rgba(239,68,68,0.08)' : 'var(--bg-secondary)',
                color: isFav ? 'var(--error)' : 'var(--text-secondary)',
                border: `1px solid ${isFav ? 'rgba(239,68,68,0.25)' : 'var(--border-medium)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'var(--transition)',
              }}
            >
              {isFav ? '❤ En favoritos' : '♡ Agregar a favoritos'}
            </button>

            {/* Owner controls */}
            {(isOwner || isAdmin) && (
              <div style={{ padding: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
                <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Gestionar</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link to={`/edit-story/${id}`}>
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.83rem' }}>Editar historia</button>
                  </Link>
                  <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.83rem' }} onClick={handleDelete}>
                    Eliminar historia
                  </button>
                </div>
              </div>
            )}

            {/* Details */}
            <div style={{ padding: '16px 18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Detalles</p>
              {[
                { l: 'Capítulos',  v: story.chapters_count },
                { l: 'Lecturas',   v: story.views_count },
                { l: 'Favoritos',  v: story.favorites_count },
                { l: 'Publicado',  v: new Date(story.created_at).toLocaleDateString('es-CR') },
              ].map(({ l, v }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
