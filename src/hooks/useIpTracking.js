import { useEffect } from 'react'
import { showToast } from '../components/Toast'

/**
 * IP 주소 추적 훅: 접속자의 IP 주소를 가져와 안내 메시지 표시
 */
export const useIpTracking = (language, translations) => {
  useEffect(() => {
    // 브라우저 환경이 아니거나 로컬 개발 환경/오프라인이면 실행하지 않음
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return
    if (!navigator.onLine) return

    // 세션 스토리지에 표시 여부 확인 (새로고침 시에는 다시 표시하지 않음)
    const hasShown = sessionStorage.getItem('ipGreetingShown')
    if (hasShown) return

    // IP 주소 가져오기
    const fetchIpAddress = async () => {
      try {
        // 여러 API를 시도 (하나가 실패하면 다음 시도)
        const apis = [
          'https://api.ipify.org?format=json',
          'https://api64.ipify.org?format=json',
          'https://ipapi.co/json/'
        ]

        let ipAddress = null

        for (const apiUrl of apis) {
          try {
            const response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              },
              // 타임아웃 설정 (5초)
              signal: AbortSignal.timeout(5000)
            })

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            
            // ipify API 응답 처리
            ipAddress = data.ip || data.query

            if (ipAddress) break
          } catch {
            // 다음 API 시도
            continue
          }
        }

        if (!ipAddress) {
          // 모든 API가 실패하면 조용히 종료 (콘솔에 에러 표시 안 함)
          return
        }

        // IP 주소가 성공적으로 가져와졌다면 안내 메시지 표시
        const t = translations[language] || translations.en || translations.ko
        
        // 메시지 포맷 (언어별로 다름)
        const message = language === 'ko' 
          ? `${ipAddress} ${t.ipGreeting}`
          : `${t.ipGreeting} ${ipAddress}`

        // 2초 지연 후 토스트 표시 (페이지 로드 후 자연스럽게)
        setTimeout(() => {
          showToast(message, language)
          sessionStorage.setItem('ipGreetingShown', 'true')
        }, 2000)

      } catch {
        // 완전히 실패해도 앱 동작에는 영향 없으므로 조용히 무시
      }
    }

    fetchIpAddress()
  }, [language, translations])
}
