import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStory, updateStory, getGenres, createChapter, updateChapter, deleteChapter } from '../api/stories'
import LoadingSpinner from '../components/LoadingSpinner'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&q=80'

export default function EditStory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [genres, setGenres] = useState([])
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('details')
  const [newChap, setNewChap] = useState({ title: '', content: '' })
  const [addingChap, setAddingChap] = useState(false)
  const [editingChap, setEditingChap] = useState(null)

  useEffect(() => {
    Promise.all([getStory(id), getGenres()])
      .then(([sRes, gRes]) => {
        const s = sRes.data
        setStory(s)
        setForm({ title: s.title, description: s.description, cover_url: s.cover_url || '', status: s.status, genre_ids: s.genres?.map((g) => g.id) || [] })
        setGenres(gRes.data.results || gRes.data)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await updateStory(id, form); navigate(`/stories/${id}`) } catch {}
    setSaving(false)
  }

  const toggleGenre = (gId) => setForm((prev) => ({
    ...prev,
    genre_ids: prev.genre_ids.includes(gId) ? prev.genre_ids.filter((g) => g !== gId) : [...prev.genre_ids, gId],
  }))

  const handleAddChap = async (e) => {
    e.preventDefault()
    if (!newChap.title.trim()) return
    try {
      const { data } = await createChapter(id, newChap)
      setStory((prev) => ({ ...prev, chapters: [...(prev.chapters || []), data] }))
      setNewChap({ title: '', content: '' })
      setAddingChap(false)
    } catch {}
  }

  const handleUpdateChap = async (chapId) => {
    try {
      const { data } = await updateChapter(id, chapId, editingChap)
      setStory((prev) => ({ ...prev, chapters: prev.chapters.map((c) => c.id === chapId ? data : c) }))
      setEditingChap(null)
    } catch {}
  }

  const handleDeleteChap = async (chapId) => {
    if (!window.confirm('¿Eliminar este capítulo?')) return
    await deleteChapter(id, chapId)
    setStory((prev) => ({ ...prev, chapters: prev.chapters.filter((c) => c.id !== chapId) }))
  }

  if (loading) return <div style={{ paddingTop: 'var(--nav-height)' }}><LoadingSpinner /></div>

  const cover = form.cover_url || story?.cover || PLACEHOLDER

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      <div className="container" style={{ maxWidth: 960, paddingTop: 36, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* LEFT — cover */}
          <div>
            <div style={{ width: '100%', aspectRatio: '2/3', background: '#eef0f8', border: '2px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
              <img src={cover} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: 8 }}>{story?.title}</p>
          </div>

          {/* RIGHT — tabs + content */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border-subtle)', marginBottom: 28 }}>
              {[{ id: 'details', l: 'Detalles de la obra' }, { id: 'chapters', l: 'Tabla de contenido' }].map((t) => (
                <button key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: '10px 20px', fontSize: '0.88rem',
                    fontWeight: tab === t.id ? 600 : 400,
                    color: tab === t.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderBottom: tab === t.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    marginBottom: '-2px', background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {/* Details tab */}
            {tab === 'details' && (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Título</label>
                  <input className="form-input" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-input" rows={4} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL de portada</label>
                  <input className="form-input" type="url" value={form.cover_url || ''} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Géneros</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
                    {genres.map((g) => {
                      const sel = form.genre_ids?.includes(g.id)
                      return (
                        <button key={g.id} type="button" onClick={() => toggleGenre(g.id)}
                          style={{
                            padding: '5px 14px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem', fontWeight: 500,
                            border: `1.5px solid ${sel ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                            background: sel ? 'var(--accent-light)' : '#fff',
                            color: sel ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer', transition: 'var(--transition-fast)',
                          }}
                        >
                          {g.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ v: 'draft', l: 'Borrador' }, { v: 'published', l: 'Publicado' }].map(({ v, l }) => (
                      <button key={v} type="button" onClick={() => setForm({ ...form, status: v })}
                        style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500, fontSize: '0.88rem', transition: 'var(--transition-fast)', border: `2px solid ${form.status === v ? 'var(--accent-primary)' : 'var(--border-medium)'}`, background: form.status === v ? 'var(--accent-light)' : '#fff', color: form.status === v ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => navigate(`/stories/${id}`)} style={{ padding: '9px 18px' }}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '9px 24px' }}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            )}

            {/* Chapters tab */}
            {tab === 'chapters' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    Partes / Capítulos
                  </h3>
                  <button className="btn btn-ghost" style={{ fontSize: '0.83rem', padding: '6px 14px' }} onClick={() => { setAddingChap(true); setEditingChap(null) }}>
                    + Parte Nueva
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {(story?.chapters || []).map((ch, i) => (
                    <div key={ch.id}>
                      {editingChap?.id === ch.id ? (
                        <div style={{ padding: 20, background: '#fff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)' }}>
                          <div className="form-group">
                            <label className="form-label">Título</label>
                            <input className="form-input" value={editingChap.title} onChange={(e) => setEditingChap({ ...editingChap, title: e.target.value })} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Contenido</label>
                            <textarea className="form-input" rows={8} value={editingChap.content} onChange={(e) => setEditingChap({ ...editingChap, content: e.target.value })} style={{ resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.8 }} />
                          </div>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-primary" onClick={() => handleUpdateChap(ch.id)} style={{ padding: '8px 20px', fontSize: '0.87rem' }}>Guardar</button>
                            <button className="btn btn-ghost" onClick={() => setEditingChap(null)} style={{ padding: '8px 16px', fontSize: '0.87rem' }}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                          <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                          <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Parte {i + 1}: {ch.title}</p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => { setEditingChap({ id: ch.id, title: ch.title, content: ch.content }); setAddingChap(false) }}>Editar</button>
                            <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.78rem' }} onClick={() => handleDeleteChap(ch.id)}>🗑</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {(story?.chapters || []).length === 0 && !addingChap && (
                    <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-medium)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sin capítulos aún. Agrega el primero.</p>
                    </div>
                  )}
                </div>

                {addingChap && (
                  <form onSubmit={handleAddChap} style={{ padding: 20, background: '#fff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)' }}>
                    <div className="form-group">
                      <label className="form-label">Título de la parte</label>
                      <input className="form-input" placeholder="Ej: El comienzo" value={newChap.title} onChange={(e) => setNewChap({ ...newChap, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contenido</label>
                      <textarea className="form-input" rows={8} placeholder="Escribe el contenido..." value={newChap.content} onChange={(e) => setNewChap({ ...newChap, content: e.target.value })} required style={{ resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.8 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.87rem' }}>Agregar parte</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setAddingChap(false)} style={{ padding: '8px 16px', fontSize: '0.87rem' }}>Cancelar</button>
                    </div>
                  </form>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-ghost" onClick={() => navigate(`/stories/${id}`)} style={{ padding: '9px 18px' }}>Ver historia</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
