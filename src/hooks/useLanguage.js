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

  // 시스템 언어 감지
  const systemLanguage = typeof window !== 'undefined' ? (() => {
    const browserLang = navigator.language || navigator.userLanguage
    if (browserLang.startsWith('ko')) return 'ko'
    if (browserLang.startsWith('zh')) return 'zh'
    return 'en'
  })() : 'en'

  // 시스템 언어와 현재 표시 언어가 다른지 확인
  const isLanguageMismatched = language !== systemLanguage

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

  return { language, toggleLanguage, languageChanged, isLanguageMismatched }
}
