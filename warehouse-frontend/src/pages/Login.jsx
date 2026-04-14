import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoLight from '../assets/18.svg'

const DEMO_ACCOUNTS = [
  { email: 'admin@warehouse.demo',       role: 'Admin',         initial: 'AD' },
  { email: 'ops@warehouse.demo',         role: 'Ops Manager',   initial: 'OM' },
  { email: 'supervisor@warehouse.demo',  role: 'Supervisor',    initial: 'SV' },
  { email: 'associate@warehouse.demo',   role: 'Associate',     initial: 'WA' },
]

export default function Login() {
  const { session, signIn, isDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/')
  }

  async function loginAs(demoEmail) {
    setError('')
    setLoading(true)
    const { error } = await signIn(demoEmail, 'demo')
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brandRow}>
          <div style={styles.logoBox}>
            <img src={logoLight} alt="Warehouse Ops" style={{ height: 32, width: 'auto', display: 'block' }} />
          </div>
        </div>

        <h1 style={styles.title}>Sign in to your account</h1>

        {isDemo && (
          <div style={styles.demoBanner}>
            <strong>Demo Mode</strong> — no Supabase needed. Click any account below to log in instantly.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@warehouse.demo"
              required
              style={styles.input}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isDemo ? 'Any password works in demo mode' : 'Password'}
              required
              style={styles.input}
            />
          </div>
          {error && <div style={styles.errorBox}>{error}</div>}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {isDemo && (
          <div style={styles.demoSection}>
            <div style={styles.dividerRow}><span style={styles.dividerText}>or sign in as</span></div>
            <div style={styles.demoGrid}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => loginAs(acc.email)}
                  disabled={loading}
                  style={styles.demoBtn}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e55a2b'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e0d9d0'}
                >
                  <div style={styles.demoBtnAvatar}>{acc.initial}</div>
                  <div>
                    <div style={styles.demoBtnRole}>{acc.role}</div>
                    <div style={styles.demoBtnEmail}>{acc.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f0e8 0%, #ede6d9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
  },
  brandRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28,
  },
  logoBox: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #e55a2b, #c94a22)',
    borderRadius: 12,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 20 },
  demoBanner: {
    background: '#fff8f0', border: '1px solid #f5c396', borderRadius: 8,
    padding: '10px 14px', fontSize: 13, color: '#a04010', marginBottom: 20,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: 8, fontSize: 14,
    border: '1.5px solid #e0d9d0', background: '#faf8f5', boxSizing: 'border-box',
    outline: 'none',
  },
  errorBox: {
    background: '#fff0f0', border: '1px solid #fdb4b4', borderRadius: 8,
    padding: '10px 14px', fontSize: 13, color: '#c0392b',
  },
  demoSection: { marginTop: 24 },
  dividerRow: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
    '::before': { content: "''", flex: 1, height: 1, background: '#e0d9d0' }
  },
  dividerText: { fontSize: 12, color: '#999', whiteSpace: 'nowrap' },
  demoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  demoBtn: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    background: '#faf8f5', border: '1.5px solid #e0d9d0', borderRadius: 10,
    cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s',
  },
  demoBtnAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: '#e85d04', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  demoBtnRole: { fontSize: 13, fontWeight: 600, color: '#1a1a2e' },
  demoBtnEmail: { fontSize: 11, color: '#888' },
}
