import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '60px 0 32px',
      marginTop: '80px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-indigo))',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#fff', fontSize: '0.9rem',
              }}>B</div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>BookMora</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Plataforma de lectura y storytelling digital. Descubre, escribe y comparte historias que inspiran.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Explorar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink to="/catalog">Catálogo</FooterLink>
              <FooterLink to="/catalog?genre=fantasia">Fantasía</FooterLink>
              <FooterLink to="/catalog?genre=romance">Romance</FooterLink>
              <FooterLink to="/catalog?genre=terror">Terror</FooterLink>
            </div>
          </div>

          {/* Cuenta */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Mi Cuenta
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink to="/profile">Perfil</FooterLink>
              <FooterLink to="/my-stories">Mis Historias</FooterLink>
              <FooterLink to="/favorites">Favoritos</FooterLink>
              <FooterLink to="/create-story">Publicar Historia</FooterLink>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} BookMora. Todos los derechos reservados.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Hecho con ♥ para amantes de las historias
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'var(--transition-fast)' }}
      onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
    >
      {children}
    </Link>
  )
}
