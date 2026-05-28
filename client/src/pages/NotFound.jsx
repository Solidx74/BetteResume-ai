import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
      <div className="relative text-center animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
        <div className="font-display font-extrabold text-8xl text-indigo-100 mb-4 select-none">404</div>
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-indigo">
          <FileText size={22} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-ink mb-2">Page not found</h1>
        <p className="text-muted mb-8">This page doesn't exist or was moved.</p>
        <Link to="/" className="btn-primary">Go home <ArrowRight size={15} /></Link>
      </div>
    </div>
  )
}
