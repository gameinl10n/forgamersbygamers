import { memo } from 'react'
import './LanguageToggle.css'

const LanguageToggle = memo(({ language, languageChanged, onToggle, tooltip, ariaLabel }) => {
  return (
    <button 
      className={`language-toggle ${languageChanged ? 'lang-changed' : ''}`} 
      onClick={onToggle} 
      aria-label={ariaLabel || 'Toggle language'}
      type="button"
    >
      <div className={`language-tooltip ${language === 'zh' ? 'chinese-font' : ''}`}>
        {tooltip}
      </div>
      <svg className="language-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle className="lang-star star-1" cx="20" cy="30" r="3" fill="#ffd700" />
        <circle className="lang-star star-2" cx="50" cy="20" r="2.5" fill="#ffd700" />
        <circle className="lang-star star-3" cx="80" cy="30" r="3" fill="#ffd700" />
        <circle className="lang-star star-4" cx="30" cy="60" r="2.5" fill="#ffd700" />
        <circle className="lang-star star-5" cx="70" cy="60" r="2.5" fill="#ffd700" />
        <circle className="lang-star star-6" cx="50" cy="70" r="2.5" fill="#ffd700" />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#ffd700"
          className={`language-text ${languageChanged ? 'lang-text-fade' : ''}`}
          aria-hidden="true"
        >
          {language.toUpperCase()}
        </text>
      </svg>
    </button>
  )
})

LanguageToggle.displayName = 'LanguageToggle'

export default LanguageToggle
