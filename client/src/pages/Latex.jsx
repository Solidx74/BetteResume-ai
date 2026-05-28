import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Copy, ExternalLink, FileCode2, ChevronLeft, CheckCheck, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/axios'

export default function Latex() {
  const { id } = useParams()
  const [latex, setLatex] = useState('')
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/resume/latex/${id}`)
      .then(r => { if (r.data.latex) setLatex(r.data.latex) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const generate = async () => {
    setGenerating(true); setError('')
    try {
      const r = await api.post('/resume/generate-latex', { analysis_id: id })
      setLatex(r.data.latex)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate LaTeX. Please try again.')
    } finally { setGenerating(false) }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(latex)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([latex], { type:'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href=url; a.download='resume.tex'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6 max-w-5xl mx-auto w-full">

        <Link to={`/analysis/${id}`}
          className="inline-flex items-center gap-2 text-muted hover:text-indigo-600 text-sm mb-6 transition-colors duration-150">
          <ChevronLeft size={15} /> Back to analysis
        </Link>

        <div className="mb-8 animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
          <p className="section-label mb-1">LaTeX resume</p>
          <h1 className="font-display font-bold text-3xl text-ink">Professional resume template</h1>
          <p className="text-muted mt-1">
            ATS-friendly LaTeX generated from your resume data. Compile on{' '}
            <a href="https://overleaf.com" target="_blank" rel="noopener noreferrer"
               className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors">
              Overleaf <ExternalLink size={11} />
            </a>{' '}for free.
          </p>
        </div>

        {loading ? (
          <div className="card text-center py-16">
            <Loader2 size={28} className="text-subtle animate-spin mx-auto mb-3" />
            <p className="text-muted text-sm">Loading…</p>
          </div>
        ) : !latex ? (
          <div className="card text-center py-20 animate-fade-up opacity-0 animate-delay-100" style={{animationFillMode:'forwards'}}>
            <div className="w-16 h-16 bg-indigo-100 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileCode2 size={28} className="text-indigo-600" />
            </div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">Generate your LaTeX resume</h2>
            <p className="text-muted text-sm mb-8 max-w-sm mx-auto">
              LLaMA AI will create a professional ATS-optimized LaTeX template from your resume data.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-red-700 text-sm max-w-sm mx-auto">{error}</div>
            )}
            <button onClick={generate} disabled={generating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {generating
                ? <><Loader2 size={16} className="animate-spin" />Generating template…</>
                : <><FileCode2 size={16} />Generate LaTeX template</>}
            </button>
            {generating && <p className="text-subtle text-xs mt-4">This may take 15–30 seconds…</p>}
          </div>
        ) : (
          <div className="animate-fade-up opacity-0 animate-delay-100" style={{animationFillMode:'forwards'}}>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-subtle text-xs font-mono ml-2">resume.tex</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} className="btn-ghost text-xs">
                  {copied?<CheckCheck size={13} className="text-emerald-500" />:<Copy size={13} />}
                  {copied?'Copied!':'Copy'}
                </button>
                <button onClick={download} className="btn-ghost text-xs">
                  <Download size={13} /> Download .tex
                </button>
                <a href="https://www.overleaf.com/latex/templates" target="_blank" rel="noopener noreferrer"
                   className="btn-primary text-xs py-1.5 px-3">
                  <ExternalLink size={12} /> Open Overleaf
                </a>
              </div>
            </div>

            {/* Code block */}
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
              <pre className="p-6 overflow-x-auto text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto">
                <code>{latex}</code>
              </pre>
            </div>

            {/* Instructions */}
            <div className="card mt-6">
              <h3 className="font-display font-semibold text-ink mb-3">How to compile</h3>
              <ol className="space-y-2 text-sm text-muted">
                {[
                  'Click "Download .tex" to get the file.',
                  'Go to overleaf.com and create a new blank project.',
                  'Replace the default content with your downloaded .tex file.',
                  'Click "Compile" — your PDF resume appears on the right.',
                  'Download the PDF when ready.',
                ].map((step,i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xs font-mono text-indigo-500 mt-0.5 shrink-0 w-4">{i+1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={generate} disabled={generating} className="btn-ghost text-sm disabled:opacity-50">
                {generating?<Loader2 size={13} className="animate-spin" />:<FileCode2 size={13} />}
                Regenerate template
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
