import { memo, useEffect, useState } from 'react'
import './ScrollIndicator.css'

const ScrollIndicator = memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight
      const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기값 설정

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-indicator" role="progressbar" aria-valuenow={scrollProgress} aria-valuemin="0" aria-valuemax="100">
      <div 
        className="scroll-indicator-bar"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
})

ScrollIndicator.displayName = 'ScrollIndicator'

export default ScrollIndicator
