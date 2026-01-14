import { useEffect, useState, useRef } from 'react'
import './App.css'

const translations = {
  en: {
    title: 'About BYEONGUK',
    subtitle: 'Unfolding the quiet story of me',
    heading: 'Localization Specialists are not merely translators',
    paragraph: 'Serve as the final cultural inspectors, maximizing the completeness of the work by leveraging their understanding of',
    language: 'language',
    culture: 'culture',
    society: 'society',
    politics: 'politics',
    arts: 'the arts',
    gamer: 'gamer',
    ending: 'I try to reach users as a',
    ending2: 'not merely as a job.'
  },
  ko: {
    title: 'About 병욱',
    subtitle: 'Unfolding the quiet story of me',
    heading: '현지화 전문가는 번역가가 아닙니다',
    paragraph: '언어의 문화, 사회, 정치, 예술적 지식을 기반으로 하여금 작품의 완성도를 최고로 올리는 최종 문화 검수자입니다',
    language: '언어',
    culture: '문화',
    society: '사회',
    politics: '정치',
    arts: '예술',
    gamer: '게이머',
    ending: '직업이 아닌, 한 명의 게이머로서',
    ending2: '게이머에게 다가가기 위해 노력합니다'
  },
  zh: {
    title: 'About 小权',
    subtitle: 'Unfolding the quiet story of me',
    heading: '本地化专家不仅仅是翻译',
    paragraph: '作为最终的文化审查者，通过利用对语言、文化、社会、政治和艺术的理解，最大化作品的完整性。我试图以游戏玩家的身份接触用户，而不仅仅是作为一份工作。',
    language: '语言',
    culture: '文化',
    society: '社会',
    politics: '政治',
    arts: '艺术',
    gamer: '游戏玩家',
    ending: '我试图以',
    ending2: '游戏玩家的身份接触用户，而不仅仅是作为一份工作。'
  }
}

// 이미지 배열
const images = [
  '/images/profile.jpg',
  '/images/profile.jpg',
  '/images/profile.jpg',
  '/images/profile.jpg',
  '/images/profile.jpg'
]

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')
  const [scrollY, setScrollY] = useState(0)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isTextHovered, setIsTextHovered] = useState(false)
  const [languageChanged, setLanguageChanged] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(2)
  const [stackOffset, setStackOffset] = useState(0)
  const [stackOffsetY, setStackOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const dragStartRef = useRef(0)
  const dragStartYRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const stackRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleLanguage = () => {
    setLanguageChanged(true)
    setLanguage(prev => {
      if (prev === 'en') return 'ko'
      if (prev === 'ko') return 'zh'
      return 'en'
    })
    setTimeout(() => setLanguageChanged(false), 300)
  }

  const handleStackMouseDown = (e) => {
    if (focusedIndex !== null) return

    setIsDragging(true)
    const startX = e.clientX
    const startY = e.clientY
    dragStartRef.current = startX
    dragStartYRef.current = startY
    currentOffsetRef.current = 0
    hasDraggedRef.current = false
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e) => {
      const dx = e.clientX - dragStartRef.current
      const dy = e.clientY - dragStartYRef.current
      
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasDraggedRef.current = true
      }
      
      currentOffsetRef.current = dx
      setStackOffset(dx)
      setStackOffsetY(dy)
    }

    const handleUp = () => {
      const threshold = 15
      const currentOffset = currentOffsetRef.current
      
      if (currentOffset > threshold) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      } else if (currentOffset < -threshold) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
      }
      
      setIsDragging(false)
      setStackOffset(0)
      setStackOffsetY(0)
      currentOffsetRef.current = 0
      
      setTimeout(() => {
        hasDraggedRef.current = false
      }, 100)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging])

  const t = translations[language]

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <svg className="theme-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
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
      <button 
        className={`language-toggle ${languageChanged ? 'lang-changed' : ''}`} 
        onClick={toggleLanguage} 
        aria-label="Toggle language"
      >
        <div className="language-tooltip">
          EN - KO - ZH 순서로 언어가 순환됩니다. 표시 언어를 바꾸고 싶으면 버튼을 눌러주세요
        </div>
        <svg className="language-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
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
          >
            {language.toUpperCase()}
          </text>
        </svg>
      </button>
      <main>
        <section 
          id="home" 
          className={`about-section ${isDarkMode ? 'dark' : 'light'}`}
          style={{
            backgroundPosition: `${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%`
          }}
          onClick={(e) => {
            // 카드, 인디케이터, 토글 버튼이 아닌 곳을 클릭했을 때만 확대 해제
            if (focusedIndex !== null && 
                !e.target.closest('.stack-card') && 
                !e.target.closest('.stack-indicator') &&
                !e.target.closest('.theme-toggle') &&
                !e.target.closest('.language-toggle')) {
              setFocusedIndex(null)
            }
          }}
        >
          <div className="container">
            <h2 
              className={`section-title ${isLoaded ? 'fade-in-up' : ''}`}
              style={{
                transform: `translateY(${-scrollY * 0.1}px)`
              }}
            >
              {t.title}
            </h2>
            <p 
              className={`section-subtitle ${isLoaded ? 'fade-in-up' : ''} fade-delay-1`}
              style={{
                transform: `translateY(${-scrollY * 0.08}px)`
              }}
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
            >
              {t.subtitle}
            </p>
            <h3 
              className={`about-heading ${isLoaded ? 'fade-in-up' : ''} fade-delay-2`}
              style={{
                transform: `translateY(${-scrollY * 0.08}px)`
              }}
            >
              {t.heading}
            </h3>
            <div 
              className={`about-text ${isLoaded ? 'fade-in-up' : ''} fade-delay-3 ${isImageHovered ? 'text-highlight' : ''}`}
              style={{
                transform: `translateY(${-scrollY * 0.08}px)`
              }}
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
            >
              <p className="about-paragraph">
                {language === 'en' ? (
                  <>
                    {t.paragraph}{' '}
                    <span className="highlight">{t.language}</span>, <span className="highlight">{t.culture}</span>,{' '}
                    <span className="highlight">{t.society}</span>, <span className="highlight">{t.politics}</span>, and{' '}
                    <span className="highlight">{t.arts}</span>. {t.ending}{' '}
                    <span className={`highlight gamer-highlight ${isImageHovered ? 'gamer-glow' : ''}`}>{t.gamer}</span>, {t.ending2}
                  </>
                ) : (
                  <>
                    {t.paragraph}
                  </>
                )}
              </p>
            </div>
            <div 
              className={`about-image-wrapper ${isLoaded ? 'fade-in-up' : ''} fade-delay-4 ${isTextHovered ? 'image-tilt' : ''}`}
              style={{
                transform: `translateY(${scrollY * 0.1}px)`
              }}
            >
              <div 
                ref={stackRef}
                className="stack-gallery"
                onMouseDown={handleStackMouseDown}
                onTouchStart={(e) => {
                  if (focusedIndex !== null) return

                  const startX = e.touches[0].clientX
                  const startY = e.touches[0].clientY
                  setIsDragging(true)
                  dragStartRef.current = startX
                  dragStartYRef.current = startY
                  currentOffsetRef.current = 0
                  hasDraggedRef.current = false
                }}
                onTouchMove={(e) => {
                  if (!isDragging) return
                  const dx = e.touches[0].clientX - dragStartRef.current
                  const dy = e.touches[0].clientY - dragStartYRef.current
                  
                  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    hasDraggedRef.current = true
                  }
                  
                  currentOffsetRef.current = dx
                  setStackOffset(dx)
                  setStackOffsetY(dy)
                }}
                onTouchEnd={() => {
                  if (!isDragging) return
                  const threshold = 15
                  const currentOffset = currentOffsetRef.current
                  
                  if (currentOffset > threshold) {
                    setCurrentImageIndex((prev) => (prev + 1) % images.length)
                  } else if (currentOffset < -threshold) {
                    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  
                  setIsDragging(false)
                  setStackOffset(0)
                  setStackOffsetY(0)
                  currentOffsetRef.current = 0
                  
                  setTimeout(() => {
                    hasDraggedRef.current = false
                  }, 100)
                }}
              >
                {images.map((img, index) => {
                  const offset = index - currentImageIndex
                  const isActive = index === currentImageIndex

                  const depth = Math.abs(offset)
                  const baseOffsetX = 100
                  const translateX = offset * baseOffsetX + (isActive ? stackOffset : 0)
                  const translateY = depth * 8 + (isActive ? stackOffsetY : 0)
                  const scale = isActive ? 1 : 1 - depth * 0.08
                  const opacity = isActive ? 1 : Math.max(0.35, 1 - depth * 0.3)
                  const baseAngle = 10
                  const rotate = offset * baseAngle

                  const zIndex = images.length - depth

                  const isFocused = focusedIndex === index

                  return (
                    <div
                      key={index}
                      className={`stack-card ${isActive ? 'active' : ''} ${isDragging && isActive ? 'dragging' : ''} ${isFocused ? 'focused' : ''}`}
                      style={{
                        zIndex,
                        transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                        opacity: Math.max(0, opacity),
                        pointerEvents: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (hasDraggedRef.current) {
                          hasDraggedRef.current = false
                          return
                        }

                        if (focusedIndex === index) {
                          setFocusedIndex(null)
                        } else {
                          setFocusedIndex(index)
                          setCurrentImageIndex(index)
                        }
                      }}
                    >
                      <div 
                        className="about-image-container"
                        onMouseEnter={() => setIsImageHovered(true)}
                        onMouseLeave={() => setIsImageHovered(false)}
                      >
                        <img 
                          src={img} 
                          alt={`BYEONGUK ${index + 1}`}
                          draggable={false}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="stack-indicator">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`stack-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

