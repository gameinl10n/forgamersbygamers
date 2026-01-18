// Analytics utility functions
// 사용하려면 Google Analytics ID나 다른 분석 도구를 설정하세요

export const initAnalytics = () => {
  // Google Analytics 예시 (사용하려면 주석 해제하고 ID 입력)
  /*
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: window.location.pathname,
    })
  }
  */
  
  // 또는 다른 분석 도구 (Plausible, Mixpanel 등)
  console.log('Analytics initialized')
}

export const trackEvent = (eventName, eventData = {}) => {
  // 이벤트 추적 함수
  // Google Analytics 예시:
  /*
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData)
  }
  */
  
  console.log('Event tracked:', eventName, eventData)
}

export const trackPageView = (path) => {
  // 페이지뷰 추적
  /*
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    })
  }
  */
  
  console.log('Page view tracked:', path)
}
