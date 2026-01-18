import { memo } from 'react'
import './ThemeToggle.css'

const ThemeToggle = memo(({ isDarkMode, onToggle, ariaLabel }) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={ariaLabel || (isDarkMode ? 'Switch to light mode' : 'Switch to dark mode')}
      type="button"
    >
      <svg className="theme-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          className="hill"
          d="M0 100 Q50 80, 100 100 T200 100 L200 120 L0 120 Z"
          fill={isDarkMode ? '#1a1a2e' : '#4a7c59'}
        />
        <circle
          className={`sun ${isDarkMode ? 'hidden' : 'visible'}`}
          cx="50"
          cy="40"
          r="20"
          fill="#ffd700"
        />
        <g className={`moon ${isDarkMode ? 'visible' : 'hidden'}`}>
          <circle cx="150" cy="30" r="18" fill="#f0f0f0" />
          <circle cx="145" cy="25" r="15" fill={isDarkMode ? '#1a1a2e' : '#f0f0f0'} />
        </g>
        {isDarkMode && (
          <>
            <circle className="star star-1" cx="30" cy="20" r="2" fill="#fff" />
            <circle className="star star-2" cx="80" cy="15" r="1.5" fill="#fff" />
            <circle className="star star-3" cx="120" cy="25" r="1.5" fill="#fff" />
            <circle className="star star-4" cx="170" cy="20" r="2" fill="#fff" />
            <circle className="star star-5" cx="40" cy="35" r="1.5" fill="#fff" />
            <circle className="star star-6" cx="100" cy="30" r="1.5" fill="#fff" />
          </>
        )}
      </svg>
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
