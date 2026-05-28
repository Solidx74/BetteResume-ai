import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, Upload, FileText } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border-light shadow-card">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo">
            <FileText size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-ink text-lg tracking-tight">
            Bette<span className="text-indigo-600">Resume</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            isActive('/dashboard')
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-muted hover:text-ink-2 hover:bg-surface-2'
          }`}>
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link to="/upload" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            isActive('/upload')
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-muted hover:text-ink-2 hover:bg-surface-2'
          }`}>
            <Upload size={15} /> Upload
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center border border-indigo-200">
              <span className="text-indigo-700 font-display font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-muted hidden sm:block">{user?.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} className="btn-ghost text-sm">
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
