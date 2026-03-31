import React from 'react'

export default function LoadingSpinner({ fullPage, size = 32, message }) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid var(--border)`,
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      {message && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{message}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
      }}>
        {spinner}
      </div>
    )
  }

  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      {spinner}
    </div>
  )
}
