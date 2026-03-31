import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── Demo mode (no Supabase needed) ──────────────────────────────────────────
// When VITE_SUPABASE_URL is not set, the app runs entirely in demo mode.
// Auth is a simple role-picker stored in sessionStorage.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const IS_DEMO = !SUPABASE_URL || SUPABASE_URL === 'your-supabase-url'

const DEMO_USERS = {
  'admin@warehouse.demo':       { id: '1', fullName: 'Alex Turner',    email: 'admin@warehouse.demo',       roleName: 'Admin' },
  'ops@warehouse.demo':         { id: '2', fullName: 'Sarah Johnson',  email: 'ops@warehouse.demo',         roleName: 'OpsManager' },
  'supervisor@warehouse.demo':  { id: '3', fullName: 'Mike Rivera',    email: 'supervisor@warehouse.demo',  roleName: 'Supervisor' },
  'associate@warehouse.demo':   { id: '5', fullName: 'Casey Williams', email: 'associate@warehouse.demo',   roleName: 'WarehouseAssociate' },
}

// Create client only when we have real credentials; otherwise null
const supabase = IS_DEMO ? null : createClient(SUPABASE_URL, SUPABASE_ANON)

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [appUser, setAppUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (IS_DEMO) {
      // Restore demo session from sessionStorage
      const saved = sessionStorage.getItem('demo_user')
      if (saved) {
        const u = JSON.parse(saved)
        setAppUser(u)
        setSession({ access_token: 'demo', user: { email: u.email } })
      }
      setLoading(false)
      return
    }

    // Real Supabase auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchAppUser(session)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchAppUser(session)
      else { setAppUser(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchAppUser(session) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/users`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const matched = data.data?.find(u => u.email === session.user.email)
        setAppUser(matched || null)
      }
    } catch {}
    setLoading(false)
  }

  async function signIn(email, password) {
    if (IS_DEMO) {
      const u = DEMO_USERS[email]
      if (!u) return { error: { message: 'Unknown demo user. Use one of the demo accounts listed below.' } }
      // Any password works in demo mode
      sessionStorage.setItem('demo_user', JSON.stringify(u))
      setAppUser(u)
      setSession({ access_token: 'demo', user: { email: u.email } })
      return { data: { user: u }, error: null }
    }
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    if (IS_DEMO) {
      sessionStorage.removeItem('demo_user')
      setAppUser(null)
      setSession(null)
      return
    }
    await supabase.auth.signOut()
    setAppUser(null)
  }

  const role = appUser?.roleName || 'WarehouseAssociate'
  const hasRole = (...roles) => roles.includes(role)
  const canApproveAdjustments = hasRole('Supervisor', 'OpsManager', 'Admin')
  const canViewReviewQueue = hasRole('Supervisor', 'OpsManager', 'Admin')
  const canViewDashboard = hasRole('OpsManager', 'Admin', 'Supervisor')
  const canViewReports = hasRole('OpsManager', 'Admin', 'Supervisor')
  const canManageAdmin = hasRole('Admin')

  return (
    <AuthContext.Provider value={{
      session, appUser, role, loading, isDemo: IS_DEMO,
      signIn, signOut,
      hasRole, canApproveAdjustments, canViewReviewQueue,
      canViewDashboard, canViewReports, canManageAdmin,
      supabase
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { supabase }
