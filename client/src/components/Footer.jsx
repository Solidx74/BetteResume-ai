import { Link } from 'react-router-dom'
import { FileText, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border-light dark:border-slate-800 bg-surface dark:bg-slate-950 py-8 px-6 mt-auto transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
            <FileText size={10} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-ink dark:text-white text-sm">
            Bette<span className="text-indigo-600 dark:text-indigo-400">Resume</span> AI
          </span>
        </div>

        {/* Attribution / Text */}
        <p className="text-subtle dark:text-slate-400 text-xs text-center">
          Built by{' '}
          <a href="https://www.linkedin.com/in/karib-sadab-43666a407/" target="_blank" rel="noopener noreferrer"
            className="text-muted dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150">
            Karib Sadab
          </a>
          {' · '}Powered by Groq LLaMA 3.3 70B · FastAPI + React
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-1 text-ink dark:text-slate-300">
          <a href="https://github.com/Solidx74" target="_blank" rel="noopener noreferrer"
            className="btn-ghost text-xs gap-1.5 dark:hover:bg-slate-900 dark:hover:text-white">
            <Github size={13} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/karib-sadab-43666a407/" target="_blank" rel="noopener noreferrer"
            className="btn-ghost text-xs gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 dark:hover:bg-slate-900">
            <Linkedin size={13} /> LinkedIn
          </a>
        </div>

      </div>
    </footer>
  )
}