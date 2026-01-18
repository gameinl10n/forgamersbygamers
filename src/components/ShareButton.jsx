import { memo } from 'react'
import './ShareButton.css'

const ShareButton = memo(({ onShare, tooltip, language, ariaLabel }) => {
  return (
    <button 
      className="share-button"
      onClick={onShare}
      aria-label={ariaLabel || 'Share this page'}
      title="Share this page"
      type="button"
    >
      <div className={`share-tooltip ${language === 'zh' ? 'chinese-font' : ''}`}>
        {tooltip}
      </div>
      <svg className="share-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g className="share-path" transform="translate(50, 50)">
          <circle cx="0" cy="-18" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
          <circle cx="-15" cy="10" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
          <circle cx="15" cy="10" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
          <line x1="0" y1="-11" x2="-10" y2="3" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="-11" x2="10" y2="3" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle className="share-star star-1" cx="50" cy="8" r="2.5" fill="#ffd700" />
        <circle className="share-star star-2" cx="72" cy="20" r="3" fill="#ffd700" />
        <circle className="share-star star-3" cx="78" cy="50" r="2.5" fill="#ffd700" />
        <circle className="share-star star-4" cx="50" cy="85" r="2.5" fill="#ffd700" />
        <circle className="share-star star-5" cx="22" cy="50" r="3" fill="#ffd700" />
        <circle className="share-star star-6" cx="28" cy="20" r="2.5" fill="#ffd700" />
        <circle className="share-star star-7" cx="50" cy="28" r="2.5" fill="#ffd700" />
      </svg>
    </button>
  )
})

ShareButton.displayName = 'ShareButton'

export default ShareButton
