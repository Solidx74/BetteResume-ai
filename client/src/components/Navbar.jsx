import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, Upload, FileText } from 'lucide-react'
import useAuthStore from '../store/authStore'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <nav className="
      fixed top-0 left-0 right-0 z-50
      bg-white dark:bg-slate-950
      border-b border-border-light dark:border-slate-900
      shadow-card transition-colors duration-200
    ">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo">
            <FileText size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-ink dark:text-white text-lg tracking-tight">
            Bette<span className="text-indigo-500 dark:text-indigo-400">Resume</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive('/dashboard')
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
                : 'text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-surface-2 dark:hover:bg-slate-900'}
            `}
          >
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link
            to="/upload"
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive('/upload')
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50'
                : 'text-muted dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-surface-2 dark:hover:bg-slate-900'}
            `}
          >
            <Upload size={15} /> Upload
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User avatar */}
          <div className="flex items-center gap-2 ml-1">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <span className="text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-muted dark:text-slate-400 hidden sm:block">
              {user?.name || 'User'}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg
              text-muted dark:text-slate-400
              hover:text-ink dark:hover:text-white
              hover:bg-surface-2 dark:hover:bg-slate-900
              transition-all duration-150
            "
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}