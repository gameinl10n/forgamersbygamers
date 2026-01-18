import { useState } from 'react'
import { STORAGE_KEYS, DEFAULT_LANGUAGE } from '../utils/constants'
import { dispatchLanguageChange } from './useLanguageRouting'

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      const langFromPath = path.split('/')[1]
      if (['en', 'ko', 'zh'].includes(langFromPath)) {
        return langFromPath
      }
      
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE)
      if (saved) return saved
      
      const browserLang = navigator.language || navigator.userLanguage
      if (browserLang.startsWith('ko')) return 'ko'
      if (browserLang.startsWith('zh')) return 'zh'
    }
    return DEFAULT_LANGUAGE
  })
  const [languageChanged, setLanguageChanged] = useState(false)

  const toggleLanguage = () => {
    setLanguageChanged(true)
    setLanguage(prev => {
      const next = prev === 'en' ? 'ko' : prev === 'ko' ? 'zh' : 'en'
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, next)
      dispatchLanguageChange()
      return next
    })
    setTimeout(() => setLanguageChanged(false), 300)
  }

  return { language, toggleLanguage, languageChanged }
}
