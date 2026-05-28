import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, TrendingUp, Clock, ArrowRight, ChevronRight, Brain, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useAuthStore from '../store/authStore'
import api from '../utils/axios'

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMe(); loadHistory() }, [])

  const loadHistory = async () => {
    try {
      const res = await api.get('/resume/history')
      setHistory(res.data)
    } catch { setHistory([]) }
    finally { setLoading(false) }
  }

  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + (h.score || 0), 0) / history.length)
    : null

  return (
    <div className="min-h-screen bg-canvas dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6 max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <p className="section-label mb-1 dark:text-indigo-400">Dashboard</p>
          <h1 className="font-display font-bold text-3xl text-ink dark:text-white">
            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-muted dark:text-slate-400 mt-1">Here's your resume analysis overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-up opacity-0 animate-delay-100" style={{ animationFillMode: 'forwards' }}>
          {[
            { label: 'Resumes analyzed', value: history.length, icon: FileText, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
            { label: 'Avg match score', value: avgScore ? `${avgScore}%` : '—', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
            { label: 'LaTeX templates', value: history.filter(h => h.has_latex).length, icon: FileText, color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
            { label: 'AI model', value: 'LLaMA 3.3', icon: Brain, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          ].map(s => (
            <div key={s.label} className="card dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-subtle dark:text-slate-400 text-xs">{s.label}</span>
                <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon size={13} className={s.color} />
                </div>
              </div>
              <div className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-fade-up opacity-0 animate-delay-200" style={{ animationFillMode: 'forwards' }}>
          <Link to="/upload" className="card-hover flex items-center justify-between border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo group-hover:scale-105 transition-transform duration-150">
                <Plus size={18} className="text-white" />
              </div>
              <div>
                <div className="font-display font-semibold text-ink dark:text-white">Analyze new resume</div>
                <div className="text-muted dark:text-slate-400 text-sm">Upload PDF or DOCX</div>
              </div>
            </div>
            <ArrowRight size={16} className="text-indigo-500 dark:text-indigo-400 group-hover:translate-x-1 transition-transform duration-150" />
          </Link>
          <div className="card dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between opacity-40 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface-2 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-muted dark:text-slate-400" />
              </div>
              <div>
                <div className="font-display font-semibold text-ink dark:text-slate-400">Compare analyses</div>
                <div className="text-muted dark:text-slate-500 text-sm">Coming soon</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-subtle dark:text-slate-500" />
          </div>
        </div>

        {/* History */}
        <div className="animate-fade-up opacity-0 animate-delay-300" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl text-ink dark:text-white">Analysis history</h2>
            {history.length > 0 && <span className="tag dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{history.length} results</span>}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="card dark:border-slate-800 animate-pulse h-20 bg-surface-2 dark:bg-slate-900" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="card dark:bg-slate-900 dark:border-slate-800 text-center py-16 border-dashed dark:border-slate-700">
              <FileText size={32} className="text-subtle dark:text-slate-600 mx-auto mb-3" />
              <p className="font-display font-semibold text-ink dark:text-white mb-1">No analyses yet</p>
              <p className="text-muted dark:text-slate-400 text-sm mb-6">Upload your first resume to get started</p>
              <Link to="/upload" className="btn-primary">
                Upload resume <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(item => (
                <Link key={item._id} to={`/analysis/${item.analysis_id || item._id}`}
                  className="card-hover dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={15} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium text-ink dark:text-white text-sm">{item.filename}</div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-subtle dark:text-slate-400 text-xs flex items-center gap-1">
                          <Clock size={11} /> {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {item.target_role && <span className="tag dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{item.target_role}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.score != null && (
                      <div className="text-right">
                        <div className={`font-display font-bold text-lg ${item.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : item.score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                          }`}>{item.score}%</div>
                        <div className="text-subtle dark:text-slate-500 text-xs">match</div>
                      </div>
                    )}
                    <ChevronRight size={15} className="text-subtle dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-150" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}