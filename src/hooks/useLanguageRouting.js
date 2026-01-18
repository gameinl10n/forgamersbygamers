import { useEffect } from 'react'

const LANGUAGE_CHANGE_EVENT = 'language-changed'

export const useLanguageRouting = () => {
  useEffect(() => {
    const updateURL = () => {
      const currentPath = window.location.pathname
      const pathParts = currentPath.split('/').filter(Boolean)
      const firstPart = pathParts[0]
      
      const currentLang = localStorage.getItem('language') || 'en'
      
      if (['en', 'ko', 'zh'].includes(firstPart)) {
        const restOfPath = pathParts.slice(1).join('/')
        const newPath = `/${currentLang}${restOfPath ? '/' + restOfPath : ''}${window.location.search}${window.location.hash}`
        if (currentPath !== newPath) {
          window.history.replaceState({}, '', newPath)
        }
      } else {
        const newPath = `/${currentLang}${currentPath === '/' ? '' : currentPath}${window.location.search}${window.location.hash}`
        window.history.replaceState({}, '', newPath)
      }
    }

    updateURL()

    // CustomEvent로 언어 변경 감지 (polling 대신)
    const handleLanguageChange = () => {
      updateURL()
    }

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange)

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange)
    }
  }, [])
}

// 언어 변경 이벤트 발행 헬퍼
export const dispatchLanguageChange = () => {
  window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT))
}
