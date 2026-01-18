import { memo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translations } from '../utils/translations'
import './ScrollToExplore.css'

const ScrollToExplore = memo(() => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="scroll-to-explore">
      <span className="scroll-to-explore-text">{t.scrollToExplore}</span>
      <div className="scroll-to-explore-icon-container">
        <div className="scroll-to-explore-arrow">⌄</div>
      </div>
    </div>
  )
})

ScrollToExplore.displayName = 'ScrollToExplore'

export default ScrollToExplore