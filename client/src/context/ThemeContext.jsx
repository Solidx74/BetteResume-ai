import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // On first load: check localStorage, default to 'light'
        const saved = localStorage.getItem('br-theme')
        return saved === 'dark' ? 'dark' : 'light'
    })

    // Apply or remove .dark class on <html> whenever theme changes
    useEffect(() => {
        const root = window.document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('br-theme', theme)
    }, [theme])

    const toggleTheme = () =>
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
    return ctx
}