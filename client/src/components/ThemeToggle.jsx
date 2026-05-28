import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="
        relative w-9 h-9 rounded-lg flex items-center justify-center
        bg-surface-2 dark:bg-slate-800
        border border-border-light dark:border-slate-700
        text-muted dark:text-slate-400
        hover:bg-indigo-50 dark:hover:bg-slate-700
        hover:text-indigo-600 dark:hover:text-indigo-400
        hover:border-indigo-200 dark:hover:border-indigo-500
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
        dark:focus:ring-offset-slate-900
      "
        >
            {/* Sun — shown in dark mode to switch back to light */}
            <Sun
                size={16}
                strokeWidth={2}
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75'}
        `}
            />
            {/* Moon — shown in light mode to switch to dark */}
            <Moon
                size={16}
                strokeWidth={2}
                className={`
          absolute transition-all duration-300
          ${isDark ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}
        `}
            />
        </button>
    )
}