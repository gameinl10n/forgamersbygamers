import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        if (localStorage.getItem(STORAGE_KEYS.DARK_MODE) === null) {
          setIsDarkMode(e.matches)
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, newMode.toString())
  }

  return { isDarkMode, toggleTheme }
}
