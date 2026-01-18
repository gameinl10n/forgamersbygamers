import { useEffect } from 'react'
import { trackEvent } from '../utils/analytics'

export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Web Vitals 라이브러리 동적 로드
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS((metric) => {
        trackEvent('web_vital', {
          name: 'CLS',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('CLS:', metric)
      })

      onFID((metric) => {
        trackEvent('web_vital', {
          name: 'FID',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('FID:', metric)
      })

      onFCP((metric) => {
        trackEvent('web_vital', {
          name: 'FCP',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('FCP:', metric)
      })

      onLCP((metric) => {
        trackEvent('web_vital', {
          name: 'LCP',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('LCP:', metric)
      })

      onTTFB((metric) => {
        trackEvent('web_vital', {
          name: 'TTFB',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('TTFB:', metric)
      })

      onINP((metric) => {
        trackEvent('web_vital', {
          name: 'INP',
          value: metric.value,
          id: metric.id,
          rating: metric.rating
        })
        console.log('INP:', metric)
      })
    }).catch((err) => {
      console.warn('Web Vitals not available:', err)
    })
  }, [])
}
