import { useState, useEffect } from 'react'
import { getGenres } from '../../api/stories'
import api from '../../api/axios'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminCategories() {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = () => {
    setLoading(true)
    getGenres().then(({ data }) => setGenres(data.results || data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const autoSlug = (name) => name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await api.patch(`/stories/genres/${editing.id}/`, form)
      } else {
        await api.post('/stories/genres/', form)
      }
      setForm({ name: '', slug: '', description: '' })
      setEditing(null)
      fetch()
    } catch {}
    setSaving(false)
  }

  const handleEdit = (g) => {
    setEditing(g)
    setForm({ name: g.name, slug: g.slug, description: g.description || '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este género?')) return
    await api.delete(`/stories/genres/${id}/`)
    setGenres((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Géneros Literarios</h1>
        <p style={{ color: 'var(--text-muted)' }}>Administra las categorías del catálogo</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Form */}
        <div style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>
            {editing ? 'Editar género' : 'Nuevo género'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.name} required
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: autoSlug(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Slug (URL)</label>
              <input className="form-input" value={form.slug} required onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear género'}
              </button>
              {editing && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ name: '', slug: '', description: '' }) }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loading ? <LoadingSpinner /> : (
            <div>
              {genres.map((g) => (
                <div key={g.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{g.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{g.slug}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-ghost" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => handleEdit(g)}>Editar</button>
                    <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => handleDelete(g.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
              {genres.length === 0 && <p style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay géneros aún.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
