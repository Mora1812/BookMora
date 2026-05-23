export default function LoadingSpinner({ size = 40, text = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '80px 0' }}>
      <div style={{
        width: size, height: size,
        border: `3px solid var(--border-subtle)`,
        borderTop: `3px solid var(--accent-primary)`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>}
    </div>
  )
}
