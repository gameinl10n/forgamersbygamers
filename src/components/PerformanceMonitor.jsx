import { memo, useState, useEffect } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import './PerformanceMonitor.css'

const PerformanceMonitor = memo(() => {
  const { language } = useLanguage()
  const [metrics, setMetrics] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 개발 모드에서만 성능 모니터 표시 (Ctrl+Shift+P)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Performance API에서 메트릭 수집
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      setMetrics({
        dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        tcp: Math.round(navigation.connectEnd - navigation.connectStart),
        request: Math.round(navigation.responseStart - navigation.requestStart),
        response: Math.round(navigation.responseEnd - navigation.responseStart),
        dom: Math.round(navigation.domContentLoadedEventEnd - navigation.responseEnd),
        load: Math.round(navigation.loadEventEnd - navigation.fetchStart),
        total: Math.round(navigation.loadEventEnd - navigation.fetchStart)
      })
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="performance-monitor" role="complementary" aria-label="Performance metrics">
      <div className="performance-monitor-header">
        <h3>{language === 'ko' ? '성능 모니터' : language === 'zh' ? '性能监控' : 'Performance Monitor'}</h3>
        <button onClick={() => setIsVisible(false)} aria-label="Close">×</button>
      </div>
      <div className="performance-monitor-body">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="performance-metric">
            <span className="metric-label">{key.toUpperCase()}:</span>
            <span className="metric-value">{value}ms</span>
          </div>
        ))}
      </div>
      <div className="performance-monitor-footer">
        <small>Ctrl+Shift+P to toggle</small>
      </div>
    </div>
  )
})

PerformanceMonitor.displayName = 'PerformanceMonitor'

export default PerformanceMonitor
