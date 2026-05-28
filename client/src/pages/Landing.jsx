import { Link } from 'react-router-dom'
import {
  ArrowRight, FileText, FileSearch, Brain, FileCode2,
  CheckCircle2, Sparkles, Github, Linkedin, ExternalLink,
  Upload, BarChart3, Download, Shield
} from 'lucide-react'
import Footer from '../components/Footer'
import profileImg from '../assets/profile.png'

const FEATURES = [
  {
    icon: FileSearch, title: 'Smart Resume Parsing',
    desc: 'Upload PDF or DOCX. AI extracts every skill, role, and achievement automatically.',
    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200'
  },
  {
    icon: Brain, title: 'Skill Gap Analysis',
    desc: 'Compare your profile against 15+ tech roles. Get a precise match score and gap report.',
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'
  },
  {
    icon: FileCode2, title: 'LaTeX Resume Generator',
    desc: 'One click generates an ATS-ready LaTeX template. Compile instantly on Overleaf for free.',
    color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200'
  },
]

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Cloud Engineer',
  'Cybersecurity Analyst', 'UI/UX Designer', 'Product Manager', 'Data Analyst',
  'Mobile App Developer', 'Database Administrator', 'Business Analyst',
]

const HOW = [
  { icon: Upload, n: '01', title: 'Upload your resume', desc: 'Drag and drop your PDF or DOCX — we handle the rest.' },
  { icon: Brain, n: '02', title: 'Pick a target role', desc: 'Choose from 15+ job roles to benchmark against.' },
  { icon: BarChart3, n: '03', title: 'Get your gap report', desc: 'See exactly which skills you have and which you\'re missing.' },
  { icon: Download, n: '04', title: 'Download LaTeX resume', desc: 'Generate a polished .tex file. Compile for free on Overleaf.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border-light shadow-card">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo">
              <FileText size={14} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-ink text-lg tracking-tight">
              Bette<span className="text-indigo-600">Resume</span>
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="hover:text-indigo-600 transition-colors duration-150">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors duration-150">How it works</a>
            <a href="#about" className="hover:text-indigo-600 transition-colors duration-150">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm hidden sm:flex">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm">Get started →</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 tag-indigo mb-8 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <Sparkles size={11} /> Powered by Groq LLaMA 3.3 70B · Free to use
          </div>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-ink leading-[1.04] tracking-tight mb-6 animate-fade-up opacity-0 animate-delay-100"
            style={{ animationFillMode: 'forwards' }}>
            Know exactly what's{' '}
            <span className="text-indigo-600 relative">
              missing
            </span>{' '}
            from your resume
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0 animate-delay-200"
            style={{ animationFillMode: 'forwards' }}>
            Upload your resume. Get an AI-powered skill gap analysis against any job role.
            Generate a professional LaTeX resume all in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 animate-delay-300"
            style={{ animationFillMode: 'forwards' }}>
            <Link to="/register" className="btn-primary text-base px-7 py-3.5">
              Analyze my resume <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-7 py-3.5">Sign in</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted animate-fade-up opacity-0 animate-delay-400"
            style={{ animationFillMode: 'forwards' }}>
            {['PDF & DOCX support', '15+ job roles', 'LaTeX export', '100% free'].map(t => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>

          {/* Mock UI */}
          <div className="max-w-3xl mx-auto mt-20 animate-fade-up opacity-0 animate-delay-400" style={{ animationFillMode: 'forwards' }}>
            <div className="card shadow-card-lg overflow-hidden">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-light">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-subtle text-xs font-mono ml-2">betteresume.app/analysis</span>
              </div>
              <div className="flex gap-6 items-center">
                <div className="relative w-24 h-24 shrink-0">
                  <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
                    <circle cx="48" cy="48" r="38" fill="none" stroke="#D1FAE5" strokeWidth="8" />
                    <circle cx="48" cy="48" r="38" fill="none" stroke="#059669" strokeWidth="8"
                      strokeDasharray="178 239" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-xl text-emerald-600">74%</span>
                    <span className="text-subtle text-[10px]">match</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag-indigo">Full Stack Developer</span>
                    <span className="tag">react_resume.pdf</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL'].map(s => <span key={s} className="tag-emerald text-[11px]">{s}</span>)}
                    {['Docker', 'Kubernetes', 'AWS'].map(s => <span key={s} className="tag-red text-[11px]">{s}</span>)}
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '74%' }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What you get</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-ink">
              Everything you need to land your next role
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className={`card border ${f.border} hover:shadow-card-md hover:scale-[1.02] transition-all duration-200`}>
                <div className={`w-11 h-11 ${f.bg} border ${f.border} rounded-xl flex items-center justify-center mb-5`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-display font-semibold text-ink text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-14 border-y border-border-light bg-canvas">
        <p className="section-label text-center mb-8">Supported job roles</p>
        <div className="flex flex-wrap justify-center gap-2.5 px-6 max-w-4xl mx-auto">
          {ROLES.map(r => (
            <span key={r} className="tag hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-150 cursor-default">{r}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The workflow</p>
            <h2 className="font-display font-bold text-3xl text-ink">From upload to offer-ready in four steps</h2>
          </div>
          <div className="space-y-4">
            {HOW.map((step, i) => (
              <div key={step.n} className="card flex gap-5 items-center hover:border-indigo-200 hover:shadow-card-md transition-all duration-200 group">
                <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border group-hover:border-indigo-200 transition-all duration-200">
                  <step.icon size={17} className="text-muted group-hover:text-indigo-600 transition-colors duration-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono text-subtle">{step.n}</span>
                    <h3 className="font-display font-semibold text-ink text-sm">{step.title}</h3>
                  </div>
                  <p className="text-muted text-sm">{step.desc}</p>
                </div>
                <CheckCircle2 size={15} className="text-border shrink-0 group-hover:text-emerald-400 transition-colors duration-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 px-6 bg-indigo-600">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, text: 'Your data is never stored permanently' },
            { icon: Brain, text: 'Powered by Groq LLaMA 3.3 70B' },
            { icon: FileCode2, text: 'ATS-friendly LaTeX output' },
            { icon: CheckCircle2, text: '100% free to use' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-2 text-white/90 text-sm">
              <t.icon size={15} className="text-emerald-300" /> {t.text}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6 bg-canvas">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The builder</p>
            <h2 className="font-display font-bold text-3xl text-ink">Built by a developer, for developers</h2>
          </div>
          <div className="card shadow-card-md flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-card-md">
                  <img src={profileImg} alt="Karib Sadab" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-2xl text-ink mb-1">Karib Sadab</h3>
              <p className="text-indigo-600 text-sm font-medium mb-4">Full Stack Developer · AI Enthusiast</p>
              <p className="text-muted text-sm leading-relaxed mb-6 max-w-lg">
                I built BetteResume to solve a problem I faced myself, not knowing which skills were holding me back from landing interviews.
                This tool combines resume parsing, LLaMA-powered analysis, and LaTeX generation into one clean workflow.
              </p>
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <a href="https://github.com/Solidx74" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-sm gap-2">
                  <Github size={15} /> GitHub <ExternalLink size={11} className="text-subtle" />
                </a>
                <a href="https://www.linkedin.com/in/karib-sadab-43666a407/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 hover:border-[#0A66C2]/50 text-[#0A66C2] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150">
                  <Linkedin size={15} /> LinkedIn <ExternalLink size={11} className="opacity-60" />
                </a>
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-2 items-center sm:items-end">
              <p className="section-label mb-1">Tech stack</p>
              {['React + Vite', 'FastAPI', 'Groq LLaMA', 'MongoDB', 'Tailwind CSS'].map(t => (
                <span key={t} className="tag text-xs">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-2xl mx-auto text-center card shadow-card-lg border-indigo-200 bg-hero-gradient">
          <div className="inline-flex items-center gap-2 tag-indigo mb-4 text-xs">
            <Sparkles size={10} /> Free · No credit card
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink mb-3 leading-tight">
            Ready to close your skill gap?
          </h2>
          <p className="text-muted mb-8 text-sm">
            Join developers who stopped guessing and started targeting the right skills.
          </p>
          <Link to="/register" className="btn-primary text-base px-8 py-3.5">
            Get started for free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
