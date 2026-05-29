import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Mail,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from 'lucide-react'

const oldResumeLines = [
  { text: 'Responsible for writing code', width: 'w-10/12', tone: 'bg-red-900/50' },
  { text: 'Worked on backend stuff', width: 'w-7/12', tone: 'bg-slate-800' },
  { text: 'Helped with bugs', width: 'w-8/12', tone: 'bg-red-950/60' },
  { text: 'Used JavaScript', width: 'w-5/12', tone: 'bg-slate-800' },
]

const successBullets = [
  'Architected distributed logging pipeline reducing system crashes by 42%',
  'Shipped React analytics dashboard used by 18 cross-functional teams',
  'Cut API response latency from 640ms to 210ms through cache redesign',
]

const modes = {
  old: {
    label: 'The Old Way',
    shortLabel: 'Rejection',
    eyebrow: 'Before BetteResume',
    title: 'A strong candidate, buried inside a weak resume.',
    copy: 'The experience is there, but vague writing and poor keyword alignment make the resume easy for ATS filters to reject.',
    score: 34,
    scoreLabel: 'ATS Score',
    ring: '#ef4444',
    track: '#450a0a',
    panel: 'from-slate-950 via-red-950/40 to-slate-950 border-red-900/60',
    accent: 'text-red-300',
  },
  success: {
    label: 'The BetteResume Way',
    shortLabel: 'Success',
    eyebrow: 'After BetteResume AI',
    title: 'The same candidate, translated into clear career impact.',
    copy: 'BetteResume turns raw experience into targeted language, skill alignment, and a resume that reads like evidence.',
    score: 98,
    scoreLabel: 'ATS Score',
    ring: '#10b981',
    track: '#064e3b',
    panel: 'from-slate-950 via-indigo-950/50 to-emerald-950/30 border-indigo-700/60',
    accent: 'text-emerald-300',
  },
}

function ScoreRing({ score, color, track, glow = false }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const dash = (score / 100) * circumference

  return (
    <div className="relative h-32 w-32 shrink-0">
      <motion.div
        className={`absolute inset-2 rounded-full ${glow ? 'bg-emerald-500/20 blur-xl' : 'bg-red-500/10 blur-lg'}`}
        animate={{ scale: glow ? [0.92, 1.08, 0.92] : [1, 1.03, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg viewBox="0 0 120 120" className="relative h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke={track} strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${dash} ${circumference - dash}` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          className="font-display text-3xl font-extrabold text-white"
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          {score}%
        </motion.span>
        <span className="text-[10px] font-mono uppercase text-slate-400">ATS match</span>
      </div>
    </div>
  )
}

function Toggle({ mode, setMode }) {
  return (
    <div className="grid w-full max-w-xl grid-cols-2 rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-card-md">
      {Object.entries(modes).map(([key, item]) => {
        const active = mode === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`relative rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 ${
              active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {active && (
              <motion.span
                layoutId="success-story-toggle"
                className={`absolute inset-0 rounded-lg ${
                  key === 'success' ? 'bg-indigo-600 shadow-indigo' : 'bg-red-950'
                }`}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              />
            )}
            <span className="relative z-10 block">{item.label}</span>
            <span className="relative z-10 block text-[10px] font-mono uppercase opacity-70">{item.shortLabel}</span>
          </button>
        )
      })}
    </div>
  )
}

function BadResumeCard() {
  return (
    <motion.div
      className="rounded-xl border border-red-900/60 bg-slate-950/95 p-5 shadow-card-lg"
      initial={{ rotate: -2, y: 18, opacity: 0 }}
      animate={{ rotate: -1, y: 0, opacity: 1 }}
      exit={{ rotate: 2, y: 18, opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-4 flex items-center justify-between border-b border-red-950 pb-3">
        <div>
          <p className="text-xs font-mono uppercase text-red-300">Bad Resume</p>
          <h3 className="font-display text-lg font-bold text-white">Alex Morgan</h3>
        </div>
        <XCircle className="text-red-400" size={22} />
      </div>
      <div className="space-y-4">
        <div className="ml-5 h-3 w-8/12 rounded bg-slate-800" />
        <div className="mr-8 h-3 w-11/12 rounded bg-red-950/70" />
        <div className="grid grid-cols-[1fr_0.7fr] gap-3">
          <div className="space-y-2">
            <div className="h-2 w-7/12 rounded bg-slate-800" />
            <div className="h-2 w-10/12 rounded bg-red-950/70" />
            <div className="h-2 w-5/12 rounded bg-slate-800" />
          </div>
          <div className="space-y-3 pt-3">
            <div className="h-8 rounded bg-red-950/50" />
            <div className="h-5 rounded bg-slate-800" />
          </div>
        </div>
        <div className="rounded-lg border border-red-950 bg-red-950/30 p-3">
          <p className="mb-2 text-[10px] font-mono uppercase text-red-300">Experience</p>
          <div className="space-y-2">
            {oldResumeLines.map((line) => (
              <div key={line.text} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <div className={`h-3 ${line.width} rounded ${line.tone}`} />
              </div>
            ))}
          </div>
        </div>
        <p className="rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-400">
          "Responsible for writing code" says what happened, but not what changed because of the work.
        </p>
      </div>
    </motion.div>
  )
}

function OptimizedResumeCard() {
  return (
    <motion.div
      className="rounded-xl border border-indigo-700/70 bg-slate-950/95 p-5 shadow-card-lg"
      initial={{ y: 18, scale: 0.96, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      exit={{ y: 18, scale: 0.96, opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-4 flex items-center justify-between border-b border-indigo-900/70 pb-3">
        <div>
          <p className="text-xs font-mono uppercase text-indigo-300">AI-Optimized Resume</p>
          <h3 className="font-display text-lg font-bold text-white">Alex Morgan</h3>
        </div>
        <CheckCircle2 className="text-emerald-400" size={22} />
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {['React', 'FastAPI', 'MongoDB'].map((skill) => (
          <span key={skill} className="rounded-lg border border-indigo-800 bg-indigo-950/60 px-2 py-1.5 text-center text-xs text-indigo-200">
            {skill}
          </span>
        ))}
      </div>
      <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
        <p className="mb-3 text-[10px] font-mono uppercase text-emerald-300">Impact bullets</p>
        <div className="space-y-3">
          {successBullets.map((bullet, index) => (
            <motion.div
              key={bullet}
              className="flex gap-3"
              initial={{ x: -14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.1 }}
            >
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={15} />
              <p className="text-sm leading-relaxed text-slate-200">
                <span className="font-semibold text-white">{bullet.split(' ').slice(0, 3).join(' ')}</span>
                {' '}
                {bullet.split(' ').slice(3).join(' ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-900 p-3">
          <p className="text-[10px] font-mono uppercase text-slate-500">Keywords</p>
          <p className="mt-1 text-sm font-semibold text-white">27 matched</p>
        </div>
        <div className="rounded-lg bg-slate-900 p-3">
          <p className="text-[10px] font-mono uppercase text-slate-500">Tone</p>
          <p className="mt-1 text-sm font-semibold text-emerald-300">Executive</p>
        </div>
      </div>
    </motion.div>
  )
}

function OldWayScene() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <BadResumeCard />
      <div className="space-y-5">
        <motion.div
          className="rounded-xl border border-red-900/60 bg-red-950/25 p-5"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
        >
          <div className="flex items-center gap-4">
            <ScoreRing score={34} color="#ef4444" track="#450a0a" />
            <div>
              <p className="text-xs font-mono uppercase text-red-300">ATS Score</p>
              <h3 className="font-display text-2xl font-bold text-white">34% visible</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Missing keywords, weak verbs, and low signal impact statements keep the resume below the shortlist.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-card-md"
          initial={{ x: 30, y: 10, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ x: 30, y: 10, opacity: 0 }}
          transition={{ delay: 0.06 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950 text-red-300">
              <Mail size={17} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Automated Rejection</p>
              <p className="text-xs text-slate-500">no-reply@careers.example</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            We regret to inform you that we will not be moving forward with your application at this time.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-950/30 px-3 py-2 text-xs text-red-200">
            <AlertTriangle size={14} />
            Resume did not meet role matching threshold
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SuccessWayScene() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <OptimizedResumeCard />
      <div className="space-y-5">
        <motion.div
          className="rounded-xl border border-emerald-800/70 bg-emerald-950/20 p-5"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
        >
          <div className="flex items-center gap-4">
            <ScoreRing score={98} color="#10b981" track="#064e3b" glow />
            <div>
              <p className="text-xs font-mono uppercase text-emerald-300">ATS Score</p>
              <h3 className="font-display text-2xl font-bold text-white">98% aligned</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Strong keywords, measurable outcomes, and role-specific language make the candidate easy to shortlist.
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="rounded-xl border border-indigo-700/70 bg-indigo-950/30 p-5 shadow-card-md"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ delay: 0.06 }}
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/70 px-3 py-1.5 text-xs font-mono text-emerald-200">
              <Zap size={13} /> Groq AI Skill Match: Excellent
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-700 bg-indigo-950 px-3 py-1.5 text-xs font-mono text-indigo-200">
              <Target size={13} /> Role-ready
            </span>
          </div>
          <motion.div
            className="rounded-xl border border-emerald-700/70 bg-slate-950 p-4"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
                <Briefcase size={17} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Interview Invitation</p>
                <p className="text-xs text-slate-500">hiring-team@company.example</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              Your background looks like a strong fit. Let's schedule a call!
            </p>
            <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-transform duration-150 hover:scale-[1.02]">
              Open calendar <ArrowRight size={13} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessStory() {
  const [mode, setMode] = useState('old')
  const active = modes[mode]

  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-800 bg-indigo-950/60 px-3 py-1.5 text-xs font-mono uppercase text-indigo-200">
              <Sparkles size={13} /> Success story simulator
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                <p className={`mb-2 text-xs font-mono uppercase tracking-widest ${active.accent}`}>{active.eyebrow}</p>
                <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  {active.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                  {active.copy}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <Toggle mode={mode} setMode={setMode} />
        </div>

        <motion.div
          className={`overflow-hidden rounded-2xl border bg-gradient-to-br p-4 shadow-card-lg sm:p-6 ${active.panel}`}
          animate={{ borderColor: mode === 'success' ? 'rgba(79, 70, 229, 0.8)' : 'rgba(127, 29, 29, 0.85)' }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'success' ? 34 : -34 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'success' ? -34 : 34 }}
              transition={{ duration: 0.34, ease: 'easeOut' }}
            >
              {mode === 'success' ? <SuccessWayScene /> : <OldWayScene />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
