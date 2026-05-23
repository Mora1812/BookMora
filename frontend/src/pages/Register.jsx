import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const LEFT_BG = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=1000&fit=crop&q=80'

function CrowIcon({ size = 36, color = '#2563eb' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M18 3C12 3 8 7 8 11.5c0 2.5 1.1 4.7 2.9 6L7 28h5.5l2-4.5 1.5 1.5-1 2.5 1 6.5h4l1-6.5-1.5-2.5 1.5-1.5 2 4.5H28l-3.9-10.5C26 15.2 27 13 27 10.5 27 6 23 3 18 3zM15 11.5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z" fill={color}/>
      <path d="M26 5c1.5 0 3.5-.5 5-2-1 2-1.5 4-4 5l-1-3z" fill={color} opacity="0.6"/>
    </svg>
  )
}

export default function Register() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const { data } = await register(form)
      loginUser(data.user, { access: data.access, refresh: data.refresh })
      navigate('/')
    } catch (err) {
      setErrors(err.response?.data || { detail: 'Error al registrarse.' })
    }
    setLoading(false)
  }

  const inp = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        required
      />
      {errors[name] && <p style={{ color: 'var(--error)', fontSize: '0.78rem', marginTop: 2 }}>{errors[name]}</p>}
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* LEFT — dark panel */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} className="auth-left-panel">
        <img src={LEFT_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(6,16,43,0.88) 0%, rgba(6,16,43,0.72) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CrowIcon size={32} color="#93c5fd" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>BookMora</span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', lineHeight: 1.3, marginBottom: '16px' }}>
              Tu historia empieza aquí. Conéctate con miles de lectores.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem' }}>— Plataforma Digital de Historias</p>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{
        width: '100%', maxWidth: 480,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 40px',
        background: '#fff',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }}>
          <CrowIcon size={30} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            BookMora
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.06em', marginBottom: '4px', textTransform: 'uppercase' }}>
          Plataforma Digital de Historias
        </p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', color: 'var(--text-primary)', marginBottom: '24px', marginTop: '4px' }}>
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit}>
          {inp('username', 'Usuario', 'text', 'tu_usuario')}
          {inp('email', 'Email', 'email', 'correo@ejemplo.com')}
          {inp('password', 'Contraseña', 'password', '••••••••')}
          {inp('password2', 'Confirmar contraseña', 'password', '••••••••')}

          {errors.detail && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              color: 'var(--error)', fontSize: '0.85rem', marginBottom: '14px',
            }}>
              {errors.detail}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>Iniciar sesión</Link>
        </p>
      </div>

      <style>{`
        .auth-left-panel { display: flex !important; }
        @media (max-width: 767px) { .auth-left-panel { display: none !important; } }
      `}</style>
    </div>
  )
}
