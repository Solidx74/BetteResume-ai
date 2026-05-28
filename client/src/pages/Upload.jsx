import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, X, ChevronDown, Brain, AlertCircle, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/axios'

const ROLES = [
  'Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer',
  'Data Scientist','Data Analyst','Machine Learning Engineer','DevOps Engineer',
  'Cloud Engineer','Cybersecurity Analyst','UI/UX Designer','Product Manager',
  'Business Analyst','Mobile App Developer','Database Administrator',
]

const STEPS = ['Upload file','Select role','Analyze']

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [role, setRole] = useState('')
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()
  const navigate = useNavigate()

  const handleFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf','docx'].includes(ext)) { setError('Only PDF and DOCX files are supported.'); return }
    if (f.size > 10*1024*1024) { setError('File must be under 10MB.'); return }
    setError(''); setFile(f); setStep(1)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleAnalyze = async () => {
    if (!file || !role) return
    setStep(2); setError('')
    const timer = setInterval(() => setProgress(p => Math.min(p + Math.random()*12, 85)), 400)
    try {
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await api.post('/resume/upload', form, { headers:{'Content-Type':'multipart/form-data'} })
      const analyzeRes = await api.post('/analyze/resume', { resume_id: uploadRes.data.resume_id, target_role: role })
      clearInterval(timer); setProgress(100)
      setTimeout(() => navigate(`/analysis/${analyzeRes.data.analysis_id}`), 500)
    } catch (err) {
      clearInterval(timer); setStep(1); setProgress(0)
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6 max-w-2xl mx-auto w-full">

        <div className="mb-8 animate-fade-up opacity-0" style={{animationFillMode:'forwards'}}>
          <p className="section-label mb-1">New analysis</p>
          <h1 className="font-display font-bold text-3xl text-ink">Upload your resume</h1>
          <p className="text-muted mt-1">PDF or DOCX · max 10MB</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 animate-fade-up opacity-0 animate-delay-100" style={{animationFillMode:'forwards'}}>
          {STEPS.map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-200 ${
                i<step?'text-emerald-600':i===step?'text-indigo-700':'text-subtle'
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all duration-200 ${
                  i<step?'bg-emerald-500 border-emerald-500 text-white':
                  i===step?'border-indigo-500 text-indigo-600 bg-indigo-50':
                  'border-border text-subtle'
                }`}>{i<step?'✓':i+1}</span>
                {s}
              </div>
              {i<STEPS.length-1 && <div className={`w-8 h-px transition-colors duration-200 ${i<step?'bg-emerald-400':'bg-border-light'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-red-700 text-sm">
            <AlertCircle size={15} className="shrink-0" />{error}
          </div>
        )}

        {step < 2 && (
          <>
            {/* Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={e=>{e.preventDefault();setIsDragging(true)}}
              onDragLeave={()=>setIsDragging(false)}
              onClick={()=>!file&&fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer mb-6 ${
                isDragging?'border-indigo-400 bg-indigo-50 scale-[1.01]':
                file?'border-emerald-300 bg-emerald-50 cursor-default':
                'border-border hover:border-indigo-300 bg-surface hover:bg-indigo-50/30'
              }`}
            >
              <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
                onChange={e=>handleFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-ink">{file.name}</div>
                    <div className="text-muted text-sm">{(file.size/1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setFile(null);setStep(0)}}
                    className="w-7 h-7 bg-surface-2 rounded-full flex items-center justify-center hover:bg-surface-3 transition-colors ml-2">
                    <X size={13} className="text-muted" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-surface-2 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload size={24} className="text-muted" />
                  </div>
                  <p className="font-display font-semibold text-ink mb-1">
                    {isDragging?'Drop it here':'Drag & drop your resume'}
                  </p>
                  <p className="text-muted text-sm">or click to browse · PDF or DOCX</p>
                </>
              )}
            </div>

            {/* Role selector */}
            {step >= 1 && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-ink-3 mb-2">Target job role</label>
                <div className="relative">
                  <Brain size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                  <select value={role} onChange={e=>setRole(e.target.value)}
                    className="input-field pl-10 pr-10 appearance-none cursor-pointer">
                    <option value="">Select a target role…</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                </div>
                <button onClick={handleAnalyze} disabled={!role}
                  className="btn-primary w-full mt-5 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">
                  <Brain size={16} /> Run AI analysis
                </button>
              </div>
            )}
          </>
        )}

        {/* Analyzing state */}
        {step === 2 && (
          <div className="card text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-indigo-100 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Brain size={28} className="text-indigo-600 animate-pulse" />
            </div>
            <h2 className="font-display font-bold text-xl text-ink mb-2">Analyzing your resume</h2>
            <p className="text-muted text-sm mb-8">LLaMA 3.3 70B is working on your skill gap report…</p>
            <div className="max-w-xs mx-auto">
              <div className="progress-bar mb-2"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
              <p className="text-subtle text-xs font-mono">{Math.round(progress)}%</p>
            </div>
            <div className="mt-8 space-y-2">
              {[
                {label:'Parsing resume content',done:progress>20},
                {label:'Extracting skills & experience',done:progress>45},
                {label:'Comparing to role requirements',done:progress>65},
                {label:'Generating recommendations',done:progress>85},
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 text-sm justify-center">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 ${
                    s.done?'bg-emerald-500 text-white':'bg-surface-2 border border-border-light'
                  }`}>{s.done?'✓':''}</span>
                  <span className={s.done?'text-ink':'text-subtle'}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
