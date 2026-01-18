import { memo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translations } from '../utils/translations'
import './SectionIndicator.css'

const SectionIndicator = memo(({ currentSection }) => {
  const { language } = useLanguage()
  const t = translations[language]

  const sections = [
    { id: 'welcome', name: t.welcomeTitle || 'Welcome' },
    { id: 'about', name: t.title || 'About' },
    { id: 'hello', name: '안녕하세요' }
  ]

  return (
    <div className="section-indicator" role="navigation" aria-label="Section navigation">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`section-indicator-dot ${currentSection === index ? 'active' : ''}`}
          aria-current={currentSection === index ? 'page' : undefined}
          aria-label={section.name}
        >
          <span className="section-indicator-label">{section.name}</span>
        </div>
      ))}
    </div>
  )
})

SectionIndicator.displayName = 'SectionIndicator'

export default SectionIndicator
