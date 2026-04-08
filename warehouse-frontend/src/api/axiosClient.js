import axios from 'axios'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const IS_DEMO = !SUPABASE_URL || SUPABASE_URL === 'your-supabase-url'

// Derive the Supabase project ref from the URL (e.g. "qlvmbrglkutmplvgqtzq")
// Supabase JS v2 stores the session at: sb-{projectRef}-auth-token
const _projectRef = SUPABASE_URL.match(/\/\/([^.]+)\./)?.[1] || ''

function getSupabaseToken() {
  if (!_projectRef) return null
  try {
    const raw = localStorage.getItem(`sb-${_projectRef}-auth-token`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.access_token || null
  } catch {
    return null
  }
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use(config => {
  if (IS_DEMO) {
    // In demo mode, pass the selected user's email so the backend can identify them
    const saved = sessionStorage.getItem('demo_user')
    if (saved) {
      const u = JSON.parse(saved)
      config.headers['X-Demo-User-Email'] = u.email
    }
  } else {
    // Real mode: read the Supabase JWT synchronously from localStorage
    const token = getSupabaseToken()
    if (token) config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Pass through raw response so API files can unwrap { success, message, data } themselves
axiosClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
)

export default axiosClient
