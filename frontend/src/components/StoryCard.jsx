import { Link } from 'react-router-dom'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&q=80'

export default function StoryCard({ story, compact }) {
  const cover = story.cover || PLACEHOLDER

  return (
    <Link to={`/stories/${story.id}`}>
      <div style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'var(--transition)',
        cursor: 'pointer',
        background: '#fff',
        boxShadow: 'var(--shadow-card)',
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
          <img
            src={cover}
            alt={story.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
            onError={(e) => { e.target.src = PLACEHOLDER }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
          />
          {story.is_featured && (
            <div style={{
              position: 'absolute', top: 8, left: 8,
              background: 'var(--accent-primary)',
              color: '#fff', fontSize: '0.62rem', fontWeight: 700,
              padding: '2px 8px', borderRadius: 'var(--radius-full)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>Destacado</div>
          )}
        </div>

        {/* Info */}
        {!compact && (
          <div style={{ padding: '12px 14px' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.93rem', fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.35,
            }}>
              {story.title}
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {story.author?.username}
            </p>
            {story.genres?.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {story.genres.slice(0, 2).map((g) => (
                  <span key={g.id} className="badge badge-genre" style={{ fontSize: '0.68rem' }}>{g.name}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
