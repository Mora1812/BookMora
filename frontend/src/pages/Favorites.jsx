import { useState, useEffect } from 'react'
import { getFavorites } from '../api/favorites'
import StoryCard from '../components/StoryCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavorites()
      .then(({ data }) => setFavorites(data.results || data))
      .finally(() => setLoading(false))
  }, [])

  const stories = favorites.map((f) => f.story_detail).filter(Boolean)

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <h1 className="section-title">Mi Biblioteca</h1>
          <p className="section-subtitle">{stories.length} historia{stories.length !== 1 ? 's' : ''} guardada{stories.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? <LoadingSpinner /> : stories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
              Tu biblioteca está vacía. ¡Empieza a explorar y guarda tus historias favoritas!
            </p>
            <Link to="/catalog">
              <button className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Explorar catálogo
              </button>
            </Link>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((s) => <StoryCard key={s.id} story={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
