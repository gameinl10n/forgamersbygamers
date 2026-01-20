import { useState, useRef, useEffect, memo, useMemo } from 'react'
import './SocialFloatingButton.css'

// 상수 정의
const HOVER_DELAY = 150 // 마우스 떠날 때 지연 시간 (ms)
const RADIUS = 80 // 아이콘들이 나열될 원의 반지름
const START_ANGLE = (-24 * Math.PI) / 18 // 약 -240도
const END_ANGLE = (-6 * Math.PI) / 18 // 약 -60도

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/', // TODO: 본인 인스타그램 프로필 URL로 교체
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="igGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f58529" />
            <stop offset="50%" stopColor="#dd2a7b" />
            <stop offset="100%" stopColor="#8134af" />
          </linearGradient>
        </defs>
        <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" fill="url(#igGradient)" />
        <circle cx="12" cy="12" r="4.3" fill="none" stroke="#ffffff" strokeWidth="1.7" />
        <circle cx="16.6" cy="7.6" r="1.2" fill="#ffffff" />
        <rect
          x="5.2"
          y="5.2"
          width="13.6"
          height="13.6"
          rx="4.5"
          ry="4.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
      </svg>
    )
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/', // TODO: 본인 링크드인 프로필 URL로 교체
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="3" ry="3" fill="#0a66c2" />
        <circle cx="7.1" cy="8" r="1.6" fill="#ffffff" />
        <rect x="5.5" y="10" width="3.2" height="7.5" fill="#ffffff" />
        <path
          d="M11 10h3v1.1h.04c.44-.78 1.48-1.4 2.83-1.4 3.02 0 3.6 1.9 3.6 4.4V17h-3.2v-2.4c0-1 0-2.3-1.44-2.3-1.43 0-1.65 1.1-1.65 2.2V17H11z"
          fill="#ffffff"
        />
      </svg>
    )
  },
  {
    id: 'brunch',
    label: 'Brunch Story',
    href: 'https://brunch.co.kr',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="#10b981" />
        <path
          d="M9 7h3.2c1.9 0 3.1 1.1 3.1 2.7 0 1.2-.7 2.1-1.9 2.4v.04C14.5 12.5 15 13.3 15 14.4 15 16.4 13.5 18 11 18H8.5V7H9zm1.8 4.2c1.2 0 1.9-.6 1.9-1.6 0-.9-.7-1.5-1.9-1.5H10.2v3.1h.6zm.2 4.6c1.3 0 2.1-.7 2.1-1.9 0-1.1-.8-1.8-2.1-1.8h-1v3.7h1z"
          fill="#ffffff"
        />
      </svg>
    )
  },
  {
    id: 'mobiinside',
    label: 'Mobiinside',
    href: 'https://www.mobiinside.co.kr/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" fill="#f97316" />
        <path
          d="M6.2 15.3V9.2L9 10.9l2.8-1.7v6.1h-1.6v-3.3L9 13.4 7.8 12v3.3H6.2z"
          fill="#ffffff"
        />
        <circle cx="16" cy="12" r="2.2" fill="#ffffff" />
        <circle cx="16" cy="12" r="1.1" fill="#f97316" />
      </svg>
    )
  },
  {
    id: 'steam',
    label: 'Steam',
    href: 'https://store.steampowered.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#111827" />
        <circle cx="15.5" cy="8.3" r="3.2" fill="#38bdf8" />
        <circle cx="15.5" cy="8.3" r="1.8" fill="#111827" />
        <circle cx="8.8" cy="14.4" r="2.1" fill="#38bdf8" />
        <circle cx="8.8" cy="14.4" r="1.1" fill="#111827" />
        <path
          d="M10 13.8l4-1.7c.5-.2.9-.5 1.2-.9"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    id: 'tistory',
    label: 'Tistory',
    href: 'https://www.tistory.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" ry="4" fill="#ea580c" />
        <path
          d="M8 8h8v2.2h-2.6V17h-2.9v-6.8H8z"
          fill="#ffffff"
        />
      </svg>
    )
  },
  {
    id: 'playstation',
    label: 'PlayStation',
    href: 'https://www.playstation.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="4" ry="4" fill="#003791" />
        <path
          d="M10 5.5l4.3 1.3c1.5.46 2.4 1.4 2.4 3.2 0 1.5-.8 2.4-2.1 2.1L11.7 11v5.4l-1.7-.5V5.5z"
          fill="#ffffff"
        />
        <path
          d="M4.5 16.8l4-1.2v1.7l-4 1.3C3.3 18.9 2.8 18.3 2.8 17.6c0-.7.4-.9 1.7-.8z"
          fill="#ffffff"
        />
        <path
          d="M13.6 14.9l4.4-1.3c1.3-.4 2.4.1 2.4 1.3 0 1-.7 1.4-2 1.1l-4.8-1.1z"
          fill="#ffffff"
        />
      </svg>
    )
  }
]

// 아이콘 위치 계산 헬퍼 함수
const calculateIconPosition = (index, total) => {
  if (total <= 1) {
    return { tx: 0, ty: 0 }
  }
  
  const step = (END_ANGLE - START_ANGLE) / (total - 1)
  const angle = START_ANGLE + step * index
  const tx = Math.cos(angle) * RADIUS
  const ty = Math.sin(angle) * RADIUS
  
  return { tx, ty }
}

const SocialFloatingButton = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      timeoutRef.current = null
    }, HOVER_DELAY)
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 아이콘 위치 계산 메모이제이션
  const iconPositions = useMemo(() => {
    return SOCIAL_LINKS.map((_, index) => 
      calculateIconPosition(index, SOCIAL_LINKS.length)
    )
  }, [])

  return (
    <div 
      className={`social-floating ${isOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="social-main-btn"
        aria-label="Show contact links"
      >
        <svg className="social-main-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* 편지지 */}
          <g className="letter">
            {/* 종이 배경 */}
            <rect
              x="55"
              y="32"
              width="90"
              height="56"
              rx="8"
              ry="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* 접힌 윗부분 */}
            <path
              d="M55 40 L100 65 L145 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 내용 줄 */}
            <path
              d="M65 48 H135"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M65 56 H125"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M65 64 H115"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          {/* 종이비행기 (hover 시 나타남) */}
          <g className="paper-plane">
            <path
              d="M95 35 L160 20 L140 85 L105 65 Z"
              fill="currentColor"
            />
            <path
              d="M95 35 L140 85 L130 90 Z"
              fill="currentColor"
              opacity="0.8"
            />
          </g>

          {/* 작은 별들 (장식) */}
          <circle className="contact-star star-1" cx="60" cy="24" r="2" />
          <circle className="contact-star star-2" cx="150" cy="20" r="1.6" />
          <circle className="contact-star star-3" cx="45" cy="60" r="1.4" />
          <circle className="contact-star star-4" cx="165" cy="55" r="1.4" />
        </svg>
      </button>

      <div className="social-popover" aria-hidden={!isOpen}>
        {SOCIAL_LINKS.map((link, index) => {
          const { tx, ty } = iconPositions[index]
          const style = {
            '--tx': `${tx}px`,
            '--ty': `${ty}px`
          }

          return (
            <a
              key={link.id}
              href={link.href}
              className={`social-icon-btn social-${link.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              aria-label={link.label}
              style={style}
            >
              {link.icon}
            </a>
          )
        })}
      </div>
    </div>
  )
})

SocialFloatingButton.displayName = 'SocialFloatingButton'

export default SocialFloatingButton

