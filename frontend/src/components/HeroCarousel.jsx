import { useState, useEffect, useCallback } from 'react'

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&q=80',
    title: 'Mundos de papel',
    sub: 'Cada libro es un universo esperando ser descubierto',
  },
  {
    img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop&q=80',
    title: 'Tu próxima historia',
    sub: 'Escribe, comparte y enamora a lectores de todo el mundo',
  },
  {
    img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop&q=80',
    title: 'La magia de leer',
    sub: 'Sumérgete en historias únicas creadas por voces nuevas',
  },
  {
    img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=600&fit=crop&q=80',
    title: 'Conecta con autores',
    sub: 'Conoce las mentes detrás de las historias que te atrapan',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 300)
  }, [transitioning])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [current, goTo])

  const slide = SLIDES[current]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      aspectRatio: '4/3',
      maxWidth: 480,
      boxShadow: '0 24px 60px rgba(37,99,235,0.16)',
    }}>
      {/* Image */}
      <img
        key={current}
        src={slide.img}
        alt={slide.title}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(6,16,43,0.72) 0%, rgba(6,16,43,0.1) 60%, transparent 100%)',
      }} />

      {/* Caption */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 22px',
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}>
        <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
          {slide.title}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', lineHeight: 1.4 }}>
          {slide.sub}
        </p>
      </div>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 14, right: 16,
        display: 'flex', gap: 6,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 20 : 7,
              height: 7,
              borderRadius: 4,
              background: i === current ? '#93c5fd' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
          border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      >
        ‹
      </button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
          border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      >
        ›
      </button>
    </div>
  )
}
