import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { token, user, fetchMe } = useAuthStore()
  const [checking, setChecking] = useState(Boolean(token && !user))

  useEffect(() => {
    let active = true

    const loadUser = async () => {
      if (!token || user) {
        setChecking(false)
        return
      }

      setChecking(true)
      await fetchMe()
      if (active) setChecking(false)
    }

    loadUser()
    return () => { active = false }
  }, [token, user, fetchMe])

  if (!token) return <Navigate to="/login" replace />
  if (checking) return null

  if (user?.is_verified === false) {
    return (
      <Navigate
        to="/register"
        replace
        state={{ verificationPending: true, email: user.email }}
      />
    )
  }

  return children
}
