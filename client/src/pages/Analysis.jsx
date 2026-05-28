import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle2, XCircle, BookOpen, TrendingUp, ArrowRight,
  FileCode2, ChevronLeft, Sparkles, AlertTriangle, FileText
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/axios'

function ScoreRing({ score }) {
  const r = 52, circ = 2*Math.PI*r
  const fill = (score/100)*circ
  const color = score>=70?'#059669':score>=40?'#D97706':'#DC2626'
  const trackColor = score>=70?'#D1FAE5':score>=40?'#FEF3C7':'#FEE2E2'
  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke={trackColor} strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${fill} ${circ-fill}`} strokeLinecap="round"
          style={{transition:'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)'}} />
      </svg>
      <div className="absolute text-center">
        <div className="font-display font-extrabold text-3xl" style={{color}}>{score}%</div>
        <div className="text-subtle text-xs">match</div>
      </div>
    </div>
  )
}

export default function Analysis() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/analyze/${id}`)
      .then(r => setData(r.data))
      .catch(() => setError('Could not load this analysis.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-border border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-muted text-sm">Loading analysis…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
        <p className="font-display font-bold text-ink mb-2">Analysis not found</p>
        <Link to="/dashboard" className="btn-secondary text-sm">Back to dashboard</Link>
      </div>
    </div>
  )

  const {
    score=0, target_role='', filename='', matching_skills=[], missing_skills=[],
    recommendations=[], summary='', extracted_skills=[], analysis_id,
  } = data

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6 max-w-5xl mx-auto w-full">

        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-indigo-600 text-sm mb-6 transition-colors duration-150">
          <ChevronLeft size={15} /> Dashboard
        </Link>

        {/* Score hero */}
        <div className="card shadow-card-md mb-6 animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <ScoreRing score={score} />
            <div className="flex-1">
              <p className="section-label mb-2">Analysis result</p>
              <h1 className="font-display font-bold text-2xl text-ink mb-2">{filename}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="tag-indigo">Target: {target_role}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  score>=70?'bg-emerald-50 text-emerald-700 border-emerald-200':
                  score>=40?'bg-amber-50 text-amber-800 border-amber-200':
                  'bg-red-50 text-red-700 border-red-200'
                }`}>{score>=70?'Strong match':score>=40?'Partial match':'Low match'}</span>
              </div>
              {summary && <p className="text-muted text-sm mt-4 leading-relaxed max-w-xl">{summary}</p>}
            </div>
            <Link to={`/latex/${analysis_id||id}`} className="btn-primary shrink-0 text-sm">
              <FileCode2 size={15} /> Generate LaTeX
            </Link>
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6 animate-fade-up opacity-0 animate-delay-100" style={{animationFillMode:'forwards'}}>
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <h2 className="font-display font-semibold text-ink">Matching skills</h2>
              <span className="tag ml-auto">{matching_skills.length}</span>
            </div>
            {matching_skills.length===0
              ? <p className="text-muted text-sm">No matching skills found.</p>
              : <div className="flex flex-wrap gap-2">{matching_skills.map(s=><span key={s} className="tag-emerald">{s}</span>)}</div>}
          </div>
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={16} className="text-red-400" />
              <h2 className="font-display font-semibold text-ink">Missing skills</h2>
              <span className="tag ml-auto">{missing_skills.length}</span>
            </div>
            {missing_skills.length===0
              ? <p className="text-muted text-sm">No skill gaps found. Great profile!</p>
              : <div className="flex flex-wrap gap-2">{missing_skills.map(s=><span key={s} className="tag-red">{s}</span>)}</div>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="card mb-6 animate-fade-up opacity-0 animate-delay-200" style={{animationFillMode:'forwards'}}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-indigo-500" />
              <h2 className="font-display font-semibold text-ink">Skills overview</h2>
            </div>
            <span className="text-subtle text-xs font-mono">{matching_skills.length} / {matching_skills.length+missing_skills.length} skills</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width:`${(matching_skills.length/Math.max(matching_skills.length+missing_skills.length,1))*100}%`}} />
          </div>
          <div className="flex justify-between mt-2 text-xs font-mono">
            <span className="text-emerald-600">{matching_skills.length} matched</span>
            <span className="text-red-500">{missing_skills.length} missing</span>
          </div>
        </div>

        {/* Extracted skills */}
        {extracted_skills.length > 0 && (
          <div className="card mb-6 animate-fade-up opacity-0 animate-delay-200" style={{animationFillMode:'forwards'}}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={15} className="text-indigo-500" />
              <h2 className="font-display font-semibold text-ink">Skills found in your resume</h2>
            </div>
            <div className="flex flex-wrap gap-2">{extracted_skills.map(s=><span key={s} className="tag-indigo">{s}</span>)}</div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="card animate-fade-up opacity-0 animate-delay-300" style={{animationFillMode:'forwards'}}>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={15} className="text-indigo-500" />
              <h2 className="font-display font-semibold text-ink">Learning recommendations</h2>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec,i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-surface-2 rounded-lg border border-border-light hover:border-indigo-200 transition-colors duration-150">
                  <span className="text-xs font-mono text-subtle mt-0.5 shrink-0 w-4">{i+1}.</span>
                  <div className="flex-1">
                    <div className="font-medium text-ink text-sm">{typeof rec==='string'?rec:rec.title}</div>
                    {rec.description && <div className="text-muted text-xs mt-1">{rec.description}</div>}
                    {rec.url && (
                      <a href={rec.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-xs mt-2 transition-colors">
                        Visit resource <ArrowRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-light animate-fade-up opacity-0 animate-delay-400" style={{animationFillMode:'forwards'}}>
          <Link to="/upload" className="btn-secondary text-sm">
            <ArrowRight size={14} className="rotate-180" /> Analyze another
          </Link>
          <Link to={`/latex/${analysis_id||id}`} className="btn-primary text-sm">
            <FileCode2 size={14} /> Generate LaTeX resume
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
