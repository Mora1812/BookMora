import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

function CrowIcon({ size = 28, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 3C12 3 8 7 8 11.5c0 2.5 1.1 4.7 2.9 6L7 28h5.5l2-4.5 1.5 1.5-1 2.5 1 6.5h4l1-6.5-1.5-2.5 1.5-1.5 2 4.5H28l-3.9-10.5C26 15.2 27 13 27 10.5 27 6 23 3 18 3zM15 11.5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z" fill={color} />
      <path d="M26 5c1.5 0 3.5-.5 5-2-1 2-1.5 4-4 5l-1-3z" fill={color} opacity="0.7" />
    </svg>
  )
}

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const menuRef = useRef(null)
  const writeRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setWriteOpen(false)
  }, [location])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (writeRef.current && !writeRef.current.contains(e.target)) setWriteOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    try { await logout(localStorage.getItem('refresh_token')) } catch {}
    logoutUser()
    navigate('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchVal.trim())}`)
    }
  }

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    background: 'var(--navbar-bg)',
    borderBottom: '1px solid var(--navbar-border)',
  }

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#0f1e42',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    minWidth: 190,
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    overflow: 'hidden',
    zIndex: 200,
  }

  const dropItemStyle = {
    display: 'block',
    padding: '10px 16px',
    fontSize: '0.87rem',
    color: 'var(--navbar-muted)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
  }

  return (
    <nav style={navStyle}>
      {/* Main bar */}
      <div className="container" style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        height: '58px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ color: '#93c5fd' }}>
            <CrowIcon size={26} color="#93c5fd" />
          </span>
          <span style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.25rem',
            fontWeight: 700, color: 'var(--navbar-text)',
            letterSpacing: '-0.01em',
          }}>
            BookMora
          </span>
        </Link>

        {/* Search bar */}
        <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--navbar-muted)', fontSize: '0.9rem', pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Buscar"
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              background: 'var(--navbar-input-bg)',
              border: '1px solid var(--navbar-input-border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--navbar-text)',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'var(--transition-fast)',
            }}
            onFocus={(e) => { e.target.style.background = 'rgba(255,255,255,0.16)'; e.target.style.borderColor = 'rgba(255,255,255,0.25)' }}
            onBlur={(e) => { e.target.style.background = 'var(--navbar-input-bg)'; e.target.style.borderColor = 'var(--navbar-input-border)' }}
          />
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          {user ? (
            <>
              {/* Escribir dropdown */}
              <div style={{ position: 'relative' }} ref={writeRef}>
                <button
                  onClick={() => setWriteOpen((v) => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '7px 13px',
                    background: 'rgba(255,255,255,0.09)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--navbar-text)',
                    fontSize: '0.87rem', fontWeight: 500,
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                >
                  Escribir <span style={{ fontSize: '0.7rem' }}>▾</span>
                </button>
                {writeOpen && (
                  <div style={dropdownStyle}>
                    <Link to="/create-story">
                      <span style={dropItemStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--navbar-text)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navbar-muted)' }}
                      >✦ Nueva historia</span>
                    </Link>
                    <Link to="/my-stories">
                      <span style={dropItemStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--navbar-text)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navbar-muted)' }}
                      >📝 Mis historias</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/panel">
                        <span style={dropItemStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--navbar-text)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navbar-muted)' }}
                        >⚙ Panel Admin</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar / user menu */}
              <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: user.avatar
                      ? 'transparent'
                      : 'linear-gradient(135deg, var(--accent-primary), var(--accent-indigo))',
                    color: '#fff',
                    fontWeight: 700, fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.18)',
                    cursor: 'pointer', overflow: 'hidden',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : user.username?.[0]?.toUpperCase()
                  }
                </button>

                {menuOpen && (
                  <div style={{ ...dropdownStyle, minWidth: 200 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navbar-text)' }}>{user.username}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--navbar-muted)', marginTop: 2 }}>{user.email}</p>
                    </div>
                    <Link to="/profile">
                      <span style={dropItemStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--navbar-text)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navbar-muted)' }}
                      >Mi Perfil</span>
                    </Link>
                    <Link to="/favorites">
                      <span style={dropItemStyle}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--navbar-text)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--navbar-muted)' }}
                      >Favoritos</span>
                    </Link>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '4px 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{ ...dropItemStyle, color: '#f87171' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register">
                <button style={{
                  color: 'var(--navbar-text)',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.87rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >Regístrate</button>
              </Link>
              <Link to="/login">
                <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.87rem' }}>
                  Iniciar Sesión
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Secondary bar */}
      <div style={{
        background: 'rgba(0,0,0,0.18)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="container" style={{ display: 'flex', gap: '20px', height: 34, alignItems: 'center' }}>
          <NavSecLink to="/catalog" label="Catálogo" />
          {user && <NavSecLink to="/my-stories" label="Mis Historias" />}
          {user && <NavSecLink to="/favorites" label="Biblioteca" />}
          {user?.role === 'admin' && <NavSecLink to="/panel" label="⚙ Admin" />}
        </div>
      </div>
    </nav>
  )
}

function NavSecLink({ to, label }) {
  const location = useLocation()
  const active = location.pathname.startsWith(to)
  return (
    <Link to={to} style={{
      fontSize: '0.82rem',
      color: active ? '#93c5fd' : 'var(--navbar-muted)',
      fontWeight: active ? 500 : 400,
      borderBottom: active ? '2px solid #93c5fd' : '2px solid transparent',
      paddingBottom: '2px',
      transition: 'var(--transition-fast)',
    }}>
      {label}
    </Link>
  )
}
