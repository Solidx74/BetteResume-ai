import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-hero-gradient dark:bg-slate-950 flex items-center justify-center px-6 transition-colors duration-200">
      <div className="absolute inset-0 bg-grid-subtle dark:opacity-20 pointer-events-none" />
      <div className="relative text-center animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>

        {/* Giant background watermark text */}
        <div className="font-display font-extrabold text-8xl text-indigo-100 dark:text-slate-900 mb-4 select-none">
          404
        </div>

        {/* Central Icon */}
        <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-indigo">
          <FileText size={22} className="text-white" />
        </div>

        {/* Heading and subtext */}
        <h1 className="font-display font-bold text-3xl text-ink dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-muted dark:text-slate-400 mb-8">
          This page doesn't exist or was moved.
        </p>

        {/* Call to action */}
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          Go home <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}