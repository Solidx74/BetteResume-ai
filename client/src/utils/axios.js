import axios from 'axios'

// In production (Vercel), VITE_API_URL points to the Render backend.
// In dev, we use /api which Vite proxies to localhost:8000.
const apiURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '')
const baseURL = apiURL
  ? `${apiURL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
