import { create } from 'zustand'
import api from '../utils/axios'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      const { access_token, user } = res.data
      localStorage.setItem('token', access_token)
      set({ token: access_token, user, isLoading: false })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/auth/register', { name, email, password })
      const { access_token, user } = res.data
      localStorage.setItem('token', access_token)
      set({ token: access_token, user, isLoading: false })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed'
      set({ error: msg, isLoading: false })
      return { success: false, error: msg }
    }
  },

  fetchMe: async () => {
    if (!localStorage.getItem('token')) return
    try {
      const res = await api.get('/auth/me')
      set({ user: res.data })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, user: null })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
