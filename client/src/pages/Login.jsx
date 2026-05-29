import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clientError, setClientError] = useState('')
  const { login, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); clearError(); setClientError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setClientError('Email and password are required')
      return
    }
    const result = await login(trimmedEmail, password)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-none dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-200">
      <div className="absolute inset-0 bg-grid-subtle dark:opacity-40 pointer-events-none" />
      <div className="relative w-full max-w-md animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>

        {/* Logo and Headings */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo">
              <FileText size={18} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-ink dark:text-white text-xl tracking-tight">
              Bette<span className="text-indigo-600 dark:text-indigo-400">Resume</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-ink dark:text-white">Welcome back</h1>
          <p className="text-muted dark:text-slate-400 text-sm mt-1">Sign in to your BetteResume account</p>
        </div>

        {/* Auth Box Container */}
        <div className="card dark:bg-slate-900 dark:border-slate-800 shadow-card-md">
          {(clientError || error) && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg px-4 py-3 mb-5 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle size={15} className="shrink-0 text-red-500 dark:text-red-400" />{clientError || error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-3 dark:text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle dark:text-slate-500 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required className="input-field dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-indigo-500 pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-3 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle dark:text-slate-500 pointer-events-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required className="input-field dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-indigo-500 pl-10" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="btn-primary w-full mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : (<>Sign in <ArrowRight size={15} /></>)}
            </button>
          </form>
        </div>

        <p className="text-center text-muted dark:text-slate-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors duration-150">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
