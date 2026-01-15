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
    paragraph: '언어의 문화, 사회, 정치, 예술적 지식을 기반으로 하여금 작품의 완성도를 최고로 올리는 최종 문화 검수자입니다.',
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
    title: 'About 权兵昱',
    subtitle: 'Unfolding the quiet story of me',
    heading: '游戏是所有学问和文化相结合的结晶',
    paragraph: '本地化专家不是翻译家。以语言的文化、社会、政治、艺术知识为基础，提高作品完成度的最终文化验收专家。作为一个玩家，而不是职业，努力接近用户。',
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
  { src: '/images/profile1.jpg', caption: { en: 'Presentation', ko: '발표', zh: '演示' } },
  { src: '/images/profile2.jpg', caption: { en: 'Workshop', ko: '워크샵', zh: '研讨会' } },
  { src: '/images/profile3.jpg', caption: { en: 'Conference', ko: '컨퍼런스', zh: '会议' } },
  { src: '/images/profile4.jpg', caption: { en: 'Collaboration', ko: '협업', zh: '合作' } },
  { src: '/images/profile5.jpg', caption: { en: 'Project', ko: '프로젝트', zh: '项目' } }
]

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 다크모드 자동 감지
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return true
  })
  const [language, setLanguage] = useState(() => {
    // 언어 자동 감지
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      if (saved) return saved
      const browserLang = navigator.language || navigator.userLanguage
      if (browserLang.startsWith('ko')) return 'ko'
      if (browserLang.startsWith('zh')) return 'zh'
    }
    return 'en'
  })
  const [scrollY, setScrollY] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [languageChanged, setLanguageChanged] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(2)
  const [stackOffset, setStackOffset] = useState(0)
  const [stackOffsetY, setStackOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [imageLoading, setImageLoading] = useState({})
  const dragStartRef = useRef(0)
  const dragStartYRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const stackRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    // 이미지 로딩 상태 초기화
    // false = 로드 완료 또는 아직 로드 시도 안 함, true = 로딩 중, 'error' = 로드 실패
    const initialLoading = {}
    images.forEach((_, index) => {
      initialLoading[index] = false // 초기에는 이미지가 보이도록 설정
    })
    setImageLoading(initialLoading)
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
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', newMode.toString())
  }

  const toggleLanguage = () => {
    setLanguageChanged(true)
    setLanguage(prev => {
      const next = prev === 'en' ? 'ko' : prev === 'ko' ? 'zh' : 'en'
      localStorage.setItem('language', next)
      return next
    })
    setTimeout(() => setLanguageChanged(false), 300)
  }

  // 타이핑 애니메이션
  useEffect(() => {
    const t = translations[language]
    const fullText = t.subtitle
    let currentIndex = 0
    setIsTyping(true)
    setTypingText('')

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypingText(fullText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [language])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC: 확대된 이미지 닫기
      if (e.key === 'Escape' && focusedIndex !== null) {
        setFocusedIndex(null)
      }
      // 화살표 키: 이미지 넘기기
      if (focusedIndex === null) {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex(prev => (prev + 1) % images.length)
        }
      }
      // L: 언어 변경
      if ((e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleLanguage()
      }
      // T: 테마 변경
      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex])

  // 다크모드 시스템 설정 감지 (localStorage가 없을 때만)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        // localStorage에 저장된 값이 없을 때만 시스템 설정 따름
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches)
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

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

  const handleWheel = (e) => {
    if (focusedIndex !== null) return
    
    e.preventDefault()
    const deltaY = e.deltaY
    
    if (deltaY > 0) {
      // 휠을 아래로 내리면 다음 이미지
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    } else if (deltaY < 0) {
      // 휠을 위로 올리면 이전 이미지
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  // 공유 기능 - 바로 링크 복사
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // 성공 메시지 (간단한 토스트)
      const toast = document.createElement('div')
      toast.textContent = '링크가 복사되었습니다!'
      toast.style.cssText = 'position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 1rem 2rem; border-radius: 25px; z-index: 10000; animation: fadeInUp 0.3s ease-out; font-family: "NEXONLv1GothicLight", sans-serif;'
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out'
        setTimeout(() => toast.remove(), 300)
      }, 2000)
    } catch (err) {
      console.log('복사 실패:', err)
      // 폴백: 알림 표시
      alert('링크 복사에 실패했습니다. 브라우저를 확인해주세요.')
    }
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
        className="share-button"
        onClick={handleShare}
        aria-label="Share"
        title="Share this page"
      >
        <div className="share-tooltip">
          공유하기 버튼을 눌러 링크를 공유할 수 있습니다
        </div>
        <svg className="share-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* 표준 공유 아이콘 - 중심 */}
          <g className="share-path" transform="translate(50, 50)">
            <circle cx="0" cy="-18" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
            <circle cx="-15" cy="10" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
            <circle cx="15" cy="10" r="7" fill="none" stroke="#ffd700" strokeWidth="2.5" />
            <line x1="0" y1="-11" x2="-10" y2="3" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="-11" x2="10" y2="3" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* 북두칠성 패턴 - 공유 아이콘 밖으로 배치 (겹치지 않도록) */}
          <circle className="share-star star-1" cx="50" cy="8" r="2.5" fill="#ffd700" />
          <circle className="share-star star-2" cx="72" cy="20" r="3" fill="#ffd700" />
          <circle className="share-star star-3" cx="78" cy="50" r="2.5" fill="#ffd700" />
          <circle className="share-star star-4" cx="50" cy="85" r="2.5" fill="#ffd700" />
          <circle className="share-star star-5" cx="22" cy="50" r="3" fill="#ffd700" />
          <circle className="share-star star-6" cx="28" cy="20" r="2.5" fill="#ffd700" />
          <circle className="share-star star-7" cx="50" cy="28" r="2.5" fill="#ffd700" />
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
          className={`about-section ${isDarkMode ? 'dark' : 'light'} ${language === 'zh' ? 'chinese-font' : ''}`}
          onClick={(e) => {
            // 카드, 인디케이터, 토글 버튼이 아닌 곳을 클릭했을 때만 확대 해제
            if (focusedIndex !== null && 
                !e.target.closest('.stack-card') && 
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
            >
              {typingText}
              {isTyping && <span className="typing-cursor">|</span>}
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
              className={`about-text ${isLoaded ? 'fade-in-up' : ''} fade-delay-3`}
              style={{
                transform: `translateY(${-scrollY * 0.08}px)`
              }}
            >
              <p className="about-paragraph">
                {language === 'en' ? (
                  <>
                    {t.paragraph}{' '}
                    <span className="highlight">{t.language}</span>, <span className="highlight">{t.culture}</span>,{' '}
                    <span className="highlight">{t.society}</span>, <span className="highlight">{t.politics}</span>, and{' '}
                    <span className="highlight">{t.arts}</span>. {t.ending}{' '}
                    <span className="highlight gamer-highlight">{t.gamer}</span>, {t.ending2}
                  </>
                ) : language === 'ko' ? (
                  <>
                    <span className="highlight">{t.language}</span>의 <span className="highlight">{t.culture}</span>, <span className="highlight">{t.society}</span>, <span className="highlight">{t.politics}</span>, <span className="highlight">{t.arts}</span>적 지식을 기반으로 하여금 작품의 완성도를 최고로 올리는 최종 문화 검수자입니다. {t.ending}, <span className="highlight gamer-highlight">{t.gamer}</span>에게 다가가기 위해 노력합니다.
                  </>
                ) : (
                  <>
                    本地化专家不是翻译家。以<span className="highlight">{t.language}</span>的<span className="highlight">{t.culture}</span>、<span className="highlight">{t.society}</span>、<span className="highlight">{t.politics}</span>、<span className="highlight">{t.arts}</span>知识为基础，提高作品完成度的最终文化验收专家。{t.ending}<span className="highlight gamer-highlight">{t.gamer}</span>{t.ending2}
                  </>
                )}
              </p>
            </div>
            <div 
              className={`about-image-wrapper ${isLoaded ? 'fade-in-up' : ''} fade-delay-4`}
              style={{
                transform: `translateY(${scrollY * 0.1}px)`
              }}
            >
              <div 
                ref={stackRef}
                className="stack-gallery"
                onMouseDown={handleStackMouseDown}
                onWheel={handleWheel}
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
                        className={`about-image-container ${isImageHovered && index === currentImageIndex ? 'image-hovered' : ''}`}
                        onMouseEnter={() => {
                          if (index === currentImageIndex) {
                            setIsImageHovered(true)
                          }
                        }}
                        onMouseLeave={() => setIsImageHovered(false)}
                      >
                        {imageLoading[index] === true && (
                          <div className="image-loading">
                            <div className="loading-spinner"></div>
                          </div>
                        )}
                        <img 
                          src={typeof img === 'string' ? img : img.src}
                          alt={`BYEONGUK ${index + 1}`}
                          draggable={false}
                          loading={index > 2 ? "lazy" : "eager"}
                          onLoadStart={() => {
                            // 이미지 로딩이 시작되면 true로 설정 (스피너 표시)
                            setImageLoading(prev => {
                              if (prev[index] === false) {
                                return { ...prev, [index]: true }
                              }
                              return prev
                            })
                          }}
                          onLoad={() => {
                            // 이미지 로드 완료 - 스피너 숨기고 이미지 표시
                            setImageLoading(prev => ({ ...prev, [index]: false }))
                          }}
                          onError={() => {
                            // 이미지 로드 실패 - 실제 네트워크 문제일 때만 스피너 표시
                            setImageLoading(prev => ({ ...prev, [index]: 'error' }))
                          }}
                          style={{ 
                            opacity: imageLoading[index] === false ? 1 : 0,
                            transition: 'opacity 0.3s ease-out',
                            display: imageLoading[index] === false ? 'block' : imageLoading[index] === 'error' ? 'none' : 'block'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

