import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStories, getGenres } from '../api/stories'
import { useAuth } from '../context/AuthContext'
import StoryCarousel from '../components/StoryCarousel'
import HeroCarousel from '../components/HeroCarousel'

// Simple Lucide-style SVG icons — inline, no library dependency
function Icon({ children, size = 22, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

const GENRE_ICONS = {
  'Romance': (
    <Icon><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>
  ),
  'Fantasía': (
    <Icon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
  ),
  'Terror': (
    <Icon><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Icon>
  ),
  'Ciencia Ficción': (
    <Icon><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>
  ),
  'Aventura': (
    <Icon><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></Icon>
  ),
  'Misterio': (
    <Icon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>
  ),
}

const GENRE_COLORS = {
  'Romance':         { bg: '#fdf2f8', color: '#be185d' },
  'Fantasía':        { bg: '#fefce8', color: '#a16207' },
  'Terror':          { bg: '#f0f0ff', color: '#4338ca' },
  'Ciencia Ficción': { bg: '#f0fdf4', color: '#15803d' },
  'Aventura':        { bg: '#fff7ed', color: '#c2410c' },
  'Misterio':        { bg: '#f8fafc', color: '#334155' },
}

const FEATURED_GENRES = ['Romance', 'Fantasía', 'Terror', 'Ciencia Ficción', 'Aventura', 'Misterio']

export default function Landing() {
  const { user } = useAuth()
  const [popular, setPopular] = useState([])
  const [genres, setGenres]   = useState([])

  useEffect(() => {
    getStories({ status: 'published', ordering: '-views_count', page_size: 12 })
      .then(({ data }) => setPopular(data.results || data))
      .catch(() => {})

    getGenres()
      .then(({ data }) => {
        const all = data.results || data
        const ordered = FEATURED_GENRES
          .map((name) => all.find((g) => g.name === name))
          .filter(Boolean)
        setGenres(ordered)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ background: '#fff' }}>

      {/* ===== HERO ===== */}
      <section style={{
        paddingTop: 'calc(var(--nav-height) + 48px)',
        paddingBottom: '72px',
        background: '#fff',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            <div>
              <p style={{
                fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--accent-primary)',
                marginBottom: 16,
              }}>
                Plataforma de lectura
              </p>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: '20px',
              }}>
                Conecta con el autor.
                <br />
                <span style={{ color: 'var(--accent-primary)' }}>Vive la historia.</span>
              </h1>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '36px',
                maxWidth: 400,
              }}>
                Lee, escribe y comparte historias únicas. Una experiencia inmersiva para quienes aman las palabras.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/catalog">
                  <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
                    Explorar historias
                  </button>
                </Link>
                <Link to={user ? "/create-story" : "/register"}>
                  <button className="btn btn-ghost" style={{ padding: '13px 24px', fontSize: '0.95rem' }}>
                    Empezar a escribir
                  </button>
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ===== LO MÁS POPULAR ===== */}
      {popular.length > 0 && (
        <section style={{ padding: '64px 0', background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 3 }}>
                  Lo más popular
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Historias que más se están leyendo ahora</p>
              </div>
              <Link to="/catalog" style={{ color: 'var(--accent-primary)', fontSize: '0.83rem', fontWeight: 500 }}>
                Ver todo →
              </Link>
            </div>
            <StoryCarousel stories={popular} />
          </div>
        </section>
      )}

      {/* ===== GÉNEROS ===== */}
      {genres.length > 0 && (
        <section style={{ padding: '72px 0', background: '#fff' }}>
          <div className="container">
            <div style={{ marginBottom: '44px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: 6 }}>
                Explora por género
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Encuentra exactamente el tipo de historia que buscas
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '20px',
            }}>
              {genres.map((g) => {
                const colors = GENRE_COLORS[g.name] || { bg: '#f8fafc', color: '#475569' }
                const icon = GENRE_ICONS[g.name]
                return (
                  <Link to={`/catalog?genre=${g.slug}`} key={g.id}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '28px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-subtle)',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      gap: '14px',
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.bg
                        e.currentTarget.style.borderColor = colors.color + '40'
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: colors.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: colors.color,
                      }}>
                        {icon || (
                          <Icon><rect x="3" y="3" width="18" height="18" rx="2" /></Icon>
                        )}
                      </div>
                      <span style={{
                        fontSize: '0.82rem', fontWeight: 600,
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                      }}>
                        {g.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section style={{
        padding: '80px 0',
        background: 'var(--navbar-bg)',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.25,
            marginBottom: '16px',
          }}>
            El fandom comienza en el primer capítulo.
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.97rem',
            lineHeight: 1.75,
            marginBottom: '32px',
          }}>
            Únete a lectores y escritores que comparten historias, comentan y descubren nuevas voces en BookMora. Gratis, siempre.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog">
              <button style={{
                padding: '13px 28px', fontSize: '0.95rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 'var(--radius-md)',
                color: '#fff', cursor: 'pointer', transition: 'var(--transition-fast)',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Explorar catálogo
              </button>
            </Link>
            <Link to="/register">
              <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
                Unirme gratis
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
