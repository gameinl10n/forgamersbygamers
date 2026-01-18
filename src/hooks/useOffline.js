import { useState, useEffect } from 'react'
import { showToast } from '../components/Toast'

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      showToast('인터넷 연결이 복구되었습니다', 'ko')
    }

    const handleOffline = () => {
      setIsOffline(true)
      showToast('오프라인 모드입니다. 일부 기능이 제한될 수 있습니다.', 'ko')
    }

    // 초기 상태 확인
    if (!navigator.onLine) {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}
