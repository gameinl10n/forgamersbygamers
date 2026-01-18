import { useEffect } from 'react'
import { initAnalytics, trackPageView } from '../utils/analytics'

export const useAnalytics = () => {
  useEffect(() => {
    initAnalytics()
    trackPageView(window.location.pathname)
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      trackPageView(window.location.pathname)
    }

    // History API 변경 감지
    const originalPushState = history.pushState
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      handleLocationChange()
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      history.pushState = originalPushState
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])
}
