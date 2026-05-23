import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop&q=80'

export default function StoryCarousel({ stories }) {
  const trackRef = useRef(null)
  const [offset, setOffset] = useState(0)

  const CARD_W = 150
  const CARD_GAP = 16
  const STEP = (CARD_W + CARD_GAP) * 3

  const maxOffset = Math.max(0, stories.length * (CARD_W + CARD_GAP) - (CARD_W + CARD_GAP) * 5)

  const prev = () => setOffset((o) => Math.max(0, o - STEP))
  const next = () => setOffset((o) => Math.min(maxOffset, o + STEP))

  const btnStyle = {
    width: 38, height: 38, borderRadius: '50%',
    background: '#fff',
    border: '1px solid var(--border-medium)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)',
    transition: 'var(--transition-fast)',
    flexShrink: 0,
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        style={{ ...btnStyle, opacity: offset === 0 ? 0.35 : 1 }}
        onClick={prev}
        disabled={offset === 0}
        onMouseEnter={(e) => { if (offset > 0) e.currentTarget.style.background = 'var(--bg-secondary)' }}
        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
      >
        ‹
      </button>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: CARD_GAP,
            transform: `translateX(-${offset}px)`,
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {stories.map((story) => (
            <Link key={story.id} to={`/stories/${story.id}`} style={{ flexShrink: 0 }}>
              <div style={{ width: CARD_W, cursor: 'pointer' }}>
                <div style={{
                  width: CARD_W,
                  height: Math.round(CARD_W * 1.5),
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.13)',
                  transition: 'var(--transition)',
                  background: '#e8eef6',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.13)' }}
                >
                  <img
                    src={story.cover || PLACEHOLDER}
                    alt={story.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                  />
                </div>
                <p style={{
                  marginTop: 8, fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {story.title}
                </p>
                {story.author && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {story.author.first_name || story.author.username}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        style={{ ...btnStyle, opacity: offset >= maxOffset ? 0.35 : 1 }}
        onClick={next}
        disabled={offset >= maxOffset}
        onMouseEnter={(e) => { if (offset < maxOffset) e.currentTarget.style.background = 'var(--bg-secondary)' }}
        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
      >
        ›
      </button>
    </div>
  )
}
