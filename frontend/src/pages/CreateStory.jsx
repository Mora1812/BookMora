import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStory, getGenres, createChapter, updateStory } from '../api/stories'

const COVER_PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&q=80'

export default function CreateStory() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [genres, setGenres] = useState([])
  const [story, setStory] = useState(null)

  // Step 1 form
  const [form, setForm] = useState({
    title: '', description: '', cover_url: '',
    genre_ids: [], status: 'draft',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Step 2 — chapters
  const [chapters, setChapters] = useState([])
  const [newChap, setNewChap] = useState({ title: '', content: '' })
  const [addingChap, setAddingChap] = useState(false)
  const [editingChap, setEditingChap] = useState(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    getGenres().then(({ data }) => setGenres(data.results || data))
  }, [])

  /* ---- step 1 submit ---- */
  const handleStep1 = async (e) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)
    try {
      const { data } = await createStory(form)
      setStory(data)
      setStep(2)
    } catch (err) {
      setErrors(err.response?.data || {})
    }
    setSaving(false)
  }

  /* ---- add chapter ---- */
  const handleAddChapter = async (e) => {
    e.preventDefault()
    if (!newChap.title.trim()) return
    try {
      const { data } = await createChapter(story.id, newChap)
      setChapters((prev) => [...prev, data])
      setNewChap({ title: '', content: '' })
      setAddingChap(false)
    } catch {}
  }

  /* ---- publish ---- */
  const handlePublish = async () => {
    setPublishing(true)
    try {
      await updateStory(story.id, { status: 'published' })
      navigate(`/stories/${story.id}`)
    } catch {}
    setPublishing(false)
  }

  const cover = form.cover_url || (story?.cover) || COVER_PLACEHOLDER

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
      <div className="container" style={{ maxWidth: 960, paddingTop: 36, paddingBottom: 60 }}>

        {/* ===== LAYOUT: left cover + right form ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>

          {/* LEFT — cover image */}
          <div>
            <div style={{
              width: '100%', aspectRatio: '2/3',
              background: '#eef0f8',
              border: '2px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden', position: 'relative',
            }}>
              {(form.cover_url || story?.cover) ? (
                <img src={cover} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>📖</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Vista previa de portada</p>
                </div>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', marginTop: 8 }}>
              {step === 1 ? 'Pega la URL de tu portada abajo' : 'Portada de la historia'}
            </p>
          </div>

          {/* RIGHT — tabs + form */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid var(--border-subtle)', marginBottom: 28 }}>
              {['Detalles de la obra', 'Tabla de contenido'].map((tab, i) => {
                const active = step === i + 1
                const disabled = i === 1 && !story
                return (
                  <button key={tab}
                    onClick={() => !disabled && setStep(i + 1)}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--accent-primary)' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                      borderBottom: active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                      marginBottom: '-2px',
                      background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* ===== STEP 1 ===== */}
            {step === 1 && (
              <form onSubmit={handleStep1}>
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input
                    className="form-input"
                    placeholder="El título de tu historia..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                  {errors.title && <p style={{ color: 'var(--error)', fontSize: '0.78rem' }}>{errors.title}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Describe de qué trata tu historia..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                  {errors.description && <p style={{ color: 'var(--error)', fontSize: '0.78rem' }}>{errors.description}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">URL de portada</label>
                  <input
                    className="form-input"
                    type="url"
                    placeholder="https://ejemplo.com/portada.jpg"
                    value={form.cover_url}
                    onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría / Géneros</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: 2 }}>
                    {genres.map((g) => {
                      const sel = form.genre_ids.includes(g.id)
                      return (
                        <button key={g.id} type="button"
                          onClick={() => setForm((prev) => ({
                            ...prev,
                            genre_ids: sel
                              ? prev.genre_ids.filter((id) => id !== g.id)
                              : [...prev.genre_ids, g.id],
                          }))}
                          style={{
                            padding: '5px 14px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem', fontWeight: 500,
                            border: `1.5px solid ${sel ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                            background: sel ? 'var(--accent-light)' : '#fff',
                            color: sel ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                          }}
                        >
                          {g.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado inicial</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[{ v: 'draft', l: 'Borrador', d: 'Solo visible para ti' }, { v: 'published', l: 'Publicado', d: 'Visible para todos' }].map(({ v, l, d }) => (
                      <button key={v} type="button"
                        onClick={() => setForm({ ...form, status: v })}
                        style={{
                          flex: 1, padding: '12px 14px', textAlign: 'left',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${form.status === v ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                          background: form.status === v ? 'var(--accent-light)' : '#fff',
                          cursor: 'pointer', transition: 'var(--transition-fast)',
                        }}
                      >
                        <p style={{ fontWeight: 600, color: form.status === v ? 'var(--accent-primary)' : 'var(--text-primary)', fontSize: '0.88rem' }}>{l}</p>
                        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>{d}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 28px' }}>
                    {saving ? 'Guardando...' : 'Siguiente →'}
                  </button>
                </div>
              </form>
            )}

            {/* ===== STEP 2 ===== */}
            {step === 2 && story && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {story.title}
                  </h3>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.83rem', padding: '6px 14px' }}
                    onClick={() => { setAddingChap(true); setEditingChap(null) }}
                  >
                    + Parte Nueva
                  </button>
                </div>

                {/* Chapter list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {chapters.map((ch, i) => (
                    <div key={ch.id}>
                      {editingChap?.id === ch.id ? (
                        <ChapterEditor
                          value={editingChap}
                          onChange={setEditingChap}
                          onSave={() => { setChapters((prev) => prev.map((c) => c.id === ch.id ? editingChap : c)); setEditingChap(null) }}
                          onCancel={() => setEditingChap(null)}
                          label="Guardar"
                        />
                      ) : (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                        }}>
                          <span style={{
                            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                            background: 'var(--accent-light)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-primary)', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                          }}>{i + 1}</span>
                          <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            Parte {i + 1}: {ch.title}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {new Date(ch.created_at || Date.now()).toLocaleDateString('es-CR')}</span>
                          <button
                            onClick={() => { setEditingChap({ id: ch.id, title: ch.title, content: ch.content }); setAddingChap(false) }}
                            style={{ color: 'var(--accent-primary)', fontSize: '0.78rem', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {chapters.length === 0 && !addingChap && (
                    <div style={{
                      padding: '32px', textAlign: 'center',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--border-medium)',
                    }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Aún no hay partes. Agrega la primera con el botón de arriba.
                      </p>
                    </div>
                  )}
                </div>

                {/* Add chapter form */}
                {addingChap && (
                  <ChapterEditor
                    value={newChap}
                    onChange={setNewChap}
                    onSave={handleAddChapter}
                    onCancel={() => setAddingChap(false)}
                    label="Agregar parte"
                    isForm
                  />
                )}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => navigate(`/stories/${story.id}`)}
                    style={{ padding: '10px 20px' }}
                  >
                    Ver historia
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{ padding: '10px 28px' }}
                  >
                    {publishing ? 'Publicando...' : 'Publicar historia'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChapterEditor({ value, onChange, onSave, onCancel, label, isForm }) {
  const el = (
    <div style={{
      padding: '20px',
      background: '#fff',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      marginBottom: 4,
    }}>
      <div className="form-group">
        <label className="form-label">Título de la parte</label>
        <input
          className="form-input"
          placeholder="Ej: El comienzo"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Contenido</label>
        <textarea
          className="form-input"
          rows={8}
          placeholder="Escribe el contenido de este capítulo..."
          value={value.content}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
          required
          style={{ resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: '0.95rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type={isForm ? 'submit' : 'button'}
          className="btn btn-primary"
          onClick={isForm ? undefined : onSave}
          style={{ padding: '9px 22px', fontSize: '0.87rem' }}
        >
          {label}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          style={{ padding: '9px 18px', fontSize: '0.87rem' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
  return isForm ? <form onSubmit={onSave}>{el}</form> : el
}
