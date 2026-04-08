import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const IS_DEMO = !SUPABASE_URL || SUPABASE_URL === 'your-supabase-url'

// Separate lightweight client for reading the session token (avoids circular imports)
const _supabase = IS_DEMO ? null : createClient(SUPABASE_URL, SUPABASE_ANON)

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(async config => {
  if (IS_DEMO) {
    // In demo mode, pass the selected user's email so the backend can identify them
    const saved = sessionStorage.getItem('demo_user')
    if (saved) {
      const u = JSON.parse(saved)
      config.headers['X-Demo-User-Email'] = u.email
    }
  } else {
    // Real mode: get the Supabase session token directly from the client
    try {
      const { data: { session } } = await _supabase.auth.getSession()
      if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`
      }
    } catch {}
  }
  return config
})

// Pass through raw response so API files can unwrap { success, message, data } themselves
axiosClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
)

export default axiosClient
