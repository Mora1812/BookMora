import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getChapter, getChapters } from '../api/stories'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ReadingView() {
  const { id: storyId, chapterId } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(18)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getChapter(storyId, chapterId),
      getChapters(storyId),
    ])
      .then(([chapRes, listRes]) => {
        setChapter(chapRes.data)
        setChapters(listRes.data.results || listRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [storyId, chapterId])

  const currentIndex = chapters.findIndex((c) => String(c.id) === String(chapterId))
  const prevChapter = chapters[currentIndex - 1]
  const nextChapter = chapters[currentIndex + 1]

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <LoadingSpinner text="Preparando tu lectura..." />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Reading toolbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 56, background: 'rgba(3,8,16,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        gap: '16px',
      }}>
        <Link to={`/stories/${storyId}`} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Volver
        </Link>
        <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
        <p style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {chapter?.title}
        </p>

        {/* Font size controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>A</span>
          <button
            onClick={() => setFontSize((f) => Math.max(14, f - 2))}
            style={{ width: 28, height: 28, borderRadius: 'var(--radius-xs)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
          >−</button>
          <button
            onClick={() => setFontSize((f) => Math.min(26, f + 2))}
            style={{ width: 28, height: 28, borderRadius: 'var(--radius-xs)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
          >+</button>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '4px' }}>A</span>
        </div>

        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            padding: '6px 12px', borderRadius: 'var(--radius-sm)',
            background: sidebarOpen ? 'var(--bg-card)' : 'transparent',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          ☰ Índice
        </button>
      </div>

      {/* Chapters sidebar */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', top: 56, right: 0, bottom: 0, width: 280,
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-subtle)',
          overflowY: 'auto', zIndex: 40, padding: '20px 0',
        }}>
          <p style={{ padding: '0 20px 16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Capítulos
          </p>
          {chapters.map((c, i) => (
            <Link key={c.id} to={`/stories/${storyId}/read/${c.id}`}>
              <div style={{
                padding: '12px 20px',
                background: String(c.id) === String(chapterId) ? 'rgba(74,144,226,0.1)' : 'transparent',
                borderLeft: String(c.id) === String(chapterId) ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'var(--transition-fast)',
              }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Capítulo {i + 1}</p>
                <p style={{ fontSize: '0.9rem', color: String(c.id) === String(chapterId) ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                  {c.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Reading area */}
      <div style={{
        maxWidth: 720, margin: '0 auto',
        padding: `80px 32px 120px`,
        paddingRight: sidebarOpen ? '320px' : '32px',
      }}>
        {/* Chapter header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Capítulo {currentIndex + 1}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>
            {chapter?.title}
          </h1>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-indigo))', margin: '20px auto 0', borderRadius: 2 }} />
        </div>

        {/* Content */}
        <div style={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.9,
          color: 'var(--text-secondary)',
          fontFamily: 'Georgia, var(--font-heading)',
          whiteSpace: 'pre-wrap',
          letterSpacing: '0.01em',
        }}>
          {chapter?.content}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '80px', paddingTop: '32px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          {prevChapter ? (
            <Link to={`/stories/${storyId}/read/${prevChapter.id}`}>
              <button className="btn btn-ghost">← {prevChapter.title}</button>
            </Link>
          ) : <div />}

          <Link to={`/stories/${storyId}`}>
            <button className="btn btn-ghost">Índice de la historia</button>
          </Link>

          {nextChapter ? (
            <Link to={`/stories/${storyId}/read/${nextChapter.id}`}>
              <button className="btn btn-primary">{nextChapter.title} →</button>
            </Link>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--success)', fontSize: '0.9rem', fontWeight: 500 }}>✓ Historia completada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
