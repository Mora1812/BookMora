import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getStories, getGenres } from '../api/stories'
import StoryCard from '../components/StoryCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [stories, setStories] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const search = searchParams.get('search') || ''
  const genre  = searchParams.get('genre')  || ''

  useEffect(() => {
    getGenres().then(({ data }) => setGenres(data.results || data))
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    const params = { status: 'published', page: 1 }
    if (search) params.search = search
    if (genre)  params['genres__slug'] = genre

    getStories(params)
      .then(({ data }) => { setStories(data.results || data); setHasNext(!!data.next) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [search, genre])

  const loadMore = () => {
    const next = page + 1
    const params = { status: 'published', page: next }
    if (search) params.search = search
    if (genre)  params['genres__slug'] = genre
    getStories(params).then(({ data }) => {
      setStories((prev) => [...prev, ...(data.results || data)])
      setHasNext(!!data.next)
      setPage(next)
    })
  }

  const setFilter = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val); else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: 'calc(var(--nav-height) + 16px)' }}>
      <div className="container" style={{ paddingBottom: 60 }}>

        {/* Header */}
        <div style={{ paddingTop: 20, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: 4 }}>
                {search ? `Resultados: "${search}"` : 'Catálogo'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {search ? 'Usa la barra de búsqueda arriba para buscar más.' : 'Descubre historias escritas por la comunidad'}
              </p>
            </div>
            {search && (
              <button className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={() => setFilter('search', '')}>
                × Limpiar búsqueda
              </button>
            )}
          </div>

          {/* Genre filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <FilterChip label="Todos" active={!genre} onClick={() => setFilter('genre', '')} />
            {genres.map((g) => (
              <FilterChip key={g.id} label={g.name} active={genre === g.slug} onClick={() => setFilter('genre', g.slug)} />
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Cargando historias..." />
        ) : stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 14 }}>📚</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No se encontraron historias.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
              {stories.length} historia{stories.length !== 1 ? 's' : ''} encontrada{stories.length !== 1 ? 's' : ''}
            </p>
            <div className="stories-grid">
              {stories.map((s) => <StoryCard key={s.id} story={s} />)}
            </div>
            {hasNext && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button className="btn btn-ghost" onClick={loadMore} style={{ padding: '11px 32px' }}>
                  Cargar más
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 15px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.8rem', fontWeight: 500,
        border: `1.5px solid ${active ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
        background: active ? 'var(--accent-light)' : '#fff',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
      }}
    >
      {label}
    </button>
  )
}
