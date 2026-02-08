import { memo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translations } from '../utils/translations'
import { SECTIONS } from '../utils/sectionConfig'
import './SectionIndicator.css'

const SectionIndicator = memo(({ currentSection, onSectionClick }) => {
  const { language } = useLanguage()
  const t = translations[language]

  const sections = SECTIONS.map(({ id, translationKey, name }) => ({
    id,
    name: name != null ? name : (t[translationKey] || translationKey)
  }))

  return (
    <div className="section-indicator" role="navigation" aria-label="Section navigation">
      {sections.map((section, index) => (
        <button
          key={section.id}
          type="button"
          className={`section-indicator-dot ${currentSection === index ? 'active' : ''}`}
          aria-current={currentSection === index ? 'page' : undefined}
          aria-label={section.name}
          onClick={() => onSectionClick?.(index)}
        >
          <span className="section-indicator-label">{section.name}</span>
        </button>
      ))}
    </div>
  )
})

SectionIndicator.displayName = 'SectionIndicator'

export default SectionIndicator
