/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas:       '#F8F9FC',
        surface:      '#FFFFFF',
        'surface-2':  '#F1F4F9',
        'surface-3':  '#E4EAF3',
        indigo: {
          50:  '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
          300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1',
          600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
        },
        emerald: {
          50:  '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0',
          300: '#6EE7B7', 400: '#34D399', 500: '#10B981',
          600: '#059669', 700: '#047857', 800: '#065F46',
        },
        ink:            '#0F172A',
        'ink-2':        '#1E293B',
        'ink-3':        '#334155',
        muted:          '#64748B',
        subtle:         '#94A3B8',
        border:         '#CBD5E1',
        'border-light': '#E2E8F0',
        amber: {
          50: '#FFFBEB', 100: '#FEF3C7', 400: '#FBBF24',
          600: '#D97706', 800: '#92400E',
        },
        red: {
          50: '#FEF2F2', 100: '#FEE2E2', 400: '#F87171',
          600: '#DC2626', 800: '#991B1B',
        },
      },
      boxShadow: {
        card:     '0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04)',
        'card-md':'0 4px 12px rgba(15,23,42,0.08),0 2px 4px rgba(15,23,42,0.04)',
        'card-lg':'0 8px 24px rgba(15,23,42,0.10),0 4px 8px rgba(15,23,42,0.06)',
        indigo:   '0 4px 14px rgba(99,102,241,0.30)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg,#EEF2FF 0%,#F8F9FC 45%,#ECFDF5 100%)',
        'grid-subtle':   "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v1H0zM0 0v40h1V0z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.35s ease forwards',
      },
      keyframes: {
        fadeUp: { '0%':{opacity:'0',transform:'translateY(18px)'},'100%':{opacity:'1',transform:'translateY(0)'} },
        fadeIn: { '0%':{opacity:'0'},'100%':{opacity:'1'} },
      },
    },
  },
  plugins: [],
}
