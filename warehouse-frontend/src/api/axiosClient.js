import axios from 'axios'

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL ||
                import.meta.env.VITE_SUPABASE_URL === 'your-supabase-url'

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
    // Real mode: attach Supabase JWT from localStorage
    const key = Object.keys(localStorage).find(k => k.includes('supabase') && k.includes('auth'))
    if (key) {
      try {
        const { access_token } = JSON.parse(localStorage.getItem(key) || '{}')
        if (access_token) config.headers['Authorization'] = `Bearer ${access_token}`
      } catch {}
    }
  }
  return config
})

// Pass through raw response so API files can unwrap { success, message, data } themselves
axiosClient.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
)

export default axiosClient
