import { useEffect, useState, useCallback, useRef, useMemo, Suspense, lazy } from 'react'
import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'
import { useTypingText } from './hooks/useTypingText'
import { useRotatingTyping } from './hooks/useRotatingTyping'
import { useSEO } from './hooks/useSEO'
import { useStructuredData } from './hooks/useStructuredData'
import { useAnalytics } from './hooks/useAnalytics'
import { useWebVitals } from './hooks/useWebVitals'
import { useLanguageRouting } from './hooks/useLanguageRouting'
import { useOffline } from './hooks/useOffline'
import { useProtection } from './hooks/useProtection'
import { useIpTracking } from './hooks/useIpTracking'
import { translations, images } from './utils/translations'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
import ShareButton from './components/ShareButton'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSkeleton from './components/LoadingSkeleton'
import { showToast } from './components/Toast'

// 지연 로딩된 컴포넌트
import ImageGallery from './components/ImageGallery'
const KeyboardShortcuts = lazy(() => import('./components/KeyboardShortcuts'))
const OfflinePage = lazy(() => import('./components/OfflinePage'))
const ScrollIndicator = lazy(() => import('./components/ScrollIndicator'))
const ScrollToExplore = lazy(() => import('./components/ScrollToExplore'))
const SectionIndicator = lazy(() => import('./components/SectionIndicator'))
const PerformanceMonitor = lazy(() => import('./components/PerformanceMonitor'))
import './styles/variables.css'
import './styles/animations.css'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const { language, toggleLanguage, languageChanged, isLanguageMismatched } = useLanguage()
  const [scrollY, setScrollY] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(2)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isGalleryHovered, setIsGalleryHovered] = useState(false)
  const scrollBufferRef = useRef(0) // 각 섹션 최대치 도달 후 누적된 스크롤 양
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const scrollHistoryRef = useRef([0])
  
  const t = translations[language]
  const { typingText, isTyping } = useTypingText(t.subtitle)
  const { displayedText: rotatingLanguage, isTyping: isRotatingTyping } = useRotatingTyping(80, 50, 2000)
  
  const isOffline = useOffline()
  
  useSEO(language)
  useStructuredData(language)
  useAnalytics()
  useWebVitals()
  useLanguageRouting()
  useProtection() // 웹사이트 보호 (우클릭 방지, 코드 복사 방지)
  useIpTracking(language, translations) // IP 주소 추적 및 안내

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setViewportHeight(window.innerHeight)
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 섹션 범위 계산 (useEffect와 렌더링에서 공통 사용)
  const sectionRanges = useMemo(() => {
    const vh = viewportHeight || window.innerHeight || 800
    const transitionRange = vh * 0.5
    const sectionGap = transitionRange * 0.4
    const bufferThreshold = transitionRange * 2.0
    const sectionBufferSize = transitionRange * 0.1
    
    return {
      transitionRange,
      sectionGap,
      topSectionMax: transitionRange * 0.5,
      secondSectionStart: transitionRange * 0.5 + sectionGap,
      secondSectionEnd: transitionRange * 2.0,
      secondSectionMax: transitionRange * 2.0,
      thirdSectionStart: transitionRange * 2.4 + sectionGap,
      thirdSectionEnd: transitionRange * 3.4,
      thirdSectionMax: transitionRange * 3.4,
      sectionBufferSize,
      secondSectionBufferEnd: transitionRange * 2.0 + sectionBufferSize,
      secondSectionFadeOutEnd: transitionRange * 2.4,
      bufferThreshold,
      maxScroll: transitionRange * 3.4
    }
  }, [viewportHeight])

  useEffect(() => {
    let ticking = false
    const {
      topSectionMax,
      secondSectionStart,
      secondSectionEnd,
      secondSectionMax,
      thirdSectionStart,
      thirdSectionEnd,
      thirdSectionMax,
      bufferThreshold,
      maxScroll
    } = sectionRanges
    
    const handleWheel = (e) => {
      // 이미지 갤러리 영역에 마우스가 있으면 스크롤 업데이트 무시
      if (isGalleryHovered) return
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = e.deltaY
          
          setScrollY(prev => {
            // 현재 어느 섹션에 있는지 확인
            const isInTopSection = prev <= topSectionMax
            const isInSecondSection = prev >= secondSectionStart && prev <= secondSectionMax
            const isInThirdSection = prev >= thirdSectionStart && prev <= thirdSectionMax
            
            // 각 섹션의 최대치에 도달했는지 확인
            const isAtSecondMax = prev >= secondSectionEnd
            const isAtThirdMax = prev >= thirdSectionEnd
            
            // 각 섹션의 최대치를 넘어서지 않도록 제한
            let newScrollY = prev + delta
            
            if (isInTopSection) {
              // 웰컴 섹션: 아래로 스크롤하면 어바웃 섹션으로 이동 가능
              if (delta > 0 && newScrollY > topSectionMax) {
                // 아래로 스크롤하여 topSectionMax를 넘어서면 어바웃 섹션으로 이동
                newScrollY = Math.max(secondSectionStart, newScrollY)
              } else {
                // 위로 스크롤하거나 범위 내면 웰컴 섹션 내에서만 이동
                newScrollY = Math.max(0, Math.min(topSectionMax, newScrollY))
              }
              scrollBufferRef.current = 0 // 섹션을 벗어나면 버퍼 리셋
            } else if (isInSecondSection) {
              // 어바웃 섹션
              if (isAtSecondMax) {
                // 최대치에 도달했으면 버퍼에 스크롤 누적
                scrollBufferRef.current += Math.abs(delta)
                
                // 버퍼 임계값을 넘었으면 다음/이전 섹션으로 이동 가능
                if (scrollBufferRef.current >= bufferThreshold) {
                  scrollBufferRef.current = 0 // 버퍼 리셋
                  if (delta > 0) {
                    // 아래로 스크롤: 안녕하세요 섹션으로 이동
                    if (newScrollY > secondSectionMax) {
                      newScrollY = Math.max(thirdSectionStart, newScrollY)
                    } else {
                      newScrollY = Math.max(secondSectionStart, Math.min(secondSectionMax, newScrollY))
                    }
                  } else {
                    // 위로 스크롤: 웰컴 섹션으로 이동
                    if (newScrollY < secondSectionStart) {
                      newScrollY = Math.min(topSectionMax, newScrollY)
                    } else {
                      newScrollY = Math.max(secondSectionStart, Math.min(secondSectionMax, newScrollY))
                    }
                  }
                } else {
                  // 아직 버퍼 임계값에 도달하지 않았으면 스크롤 무시 (최대치 유지)
                  return prev
                }
              } else {
                // 최대치에 도달하지 않았으면 정상적으로 스크롤
                // 위로 스크롤하면 웰컴 섹션으로 이동 가능
                if (delta < 0 && newScrollY < secondSectionStart) {
                  // 위로 스크롤하여 secondSectionStart보다 작아지면 웰컴 섹션으로 이동
                  newScrollY = Math.min(topSectionMax, newScrollY)
                } else {
                  // 아래로 스크롤하거나 범위 내면 어바웃 섹션 내에서만 이동
                  newScrollY = Math.max(secondSectionStart, Math.min(secondSectionMax, newScrollY))
                }
                scrollBufferRef.current = 0 // 최대치를 벗어나면 버퍼 리셋
              }
            } else if (isInThirdSection) {
              // 안녕하세요 섹션
              if (isAtThirdMax) {
                // 최대치에 도달했으면 버퍼에 스크롤 누적
                scrollBufferRef.current += Math.abs(delta)
                
                // 버퍼 임계값을 넘었으면 이전 섹션으로 이동 가능 (마지막 섹션이므로)
                if (scrollBufferRef.current >= bufferThreshold) {
                  scrollBufferRef.current = 0 // 버퍼 리셋
                  if (delta < 0) {
                    // 위로 스크롤: 어바웃 섹션으로 이동
                    if (newScrollY < thirdSectionStart) {
                      newScrollY = Math.min(secondSectionMax, newScrollY)
                    } else {
                      newScrollY = Math.max(thirdSectionStart, Math.min(thirdSectionMax, newScrollY))
                    }
                  } else {
                    // 아래로 스크롤: 최대치 유지
                    newScrollY = thirdSectionMax
                  }
                } else {
                  // 아직 버퍼 임계값에 도달하지 않았으면 스크롤 무시 (최대치 유지)
                  return prev
                }
              } else {
                // 최대치에 도달하지 않았으면 정상적으로 스크롤
                // 위로 스크롤하면 어바웃 섹션으로 이동 가능
                if (delta < 0 && newScrollY < thirdSectionStart) {
                  // 위로 스크롤하여 thirdSectionStart보다 작아지면 어바웃 섹션으로 이동
                  newScrollY = Math.min(secondSectionMax, newScrollY)
                } else {
                  // 아래로 스크롤하거나 범위 내면 안녕하세요 섹션 내에서만 이동
                  newScrollY = Math.max(thirdSectionStart, Math.min(thirdSectionMax, newScrollY))
                }
                scrollBufferRef.current = 0 // 최대치를 벗어나면 버퍼 리셋
              }
            } else {
              // 섹션 경계를 넘어서는 경우: 현재 섹션의 최대치로 제한
              if (prev < secondSectionStart) {
                newScrollY = Math.max(0, Math.min(topSectionMax, newScrollY))
              } else if (prev < thirdSectionStart) {
                newScrollY = Math.max(secondSectionStart, Math.min(secondSectionMax, newScrollY))
              } else {
                newScrollY = Math.max(thirdSectionStart, Math.min(thirdSectionMax, newScrollY))
              }
              scrollBufferRef.current = 0 // 섹션 경계를 넘어서면 버퍼 리셋
            }
            
            return Math.max(0, Math.min(maxScroll, newScrollY))
          })
          ticking = false
        })
        ticking = true
      }
      
      // 기본 스크롤 방지
      e.preventDefault()
    }
    
    // 터치 제스처로 섹션 전환
    const handleTouchStart = (e) => {
      if (isGalleryHovered) return
      const touch = e.touches[0]
      touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
    }

    const handleTouchEnd = (e) => {
      if (isGalleryHovered) return
      if (!touchStartRef.current.x) return
      
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y
      const deltaTime = Date.now() - touchStartRef.current.time
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // 최소 이동 거리 및 시간 체크
      if (distance > 50 && deltaTime < 300) {
        const { topSectionMax, secondSectionStart, secondSectionEnd, secondSectionMax, thirdSectionStart, thirdSectionEnd, thirdSectionMax } = sectionRanges
        
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          // 수직 스와이프
          e.preventDefault()
          setScrollY(prev => {
            if (deltaY < 0) {
              // 위로 스와이프 (다음 섹션)
              if (prev < topSectionMax) return secondSectionStart
              if (prev >= secondSectionStart && prev < secondSectionMax) return thirdSectionStart
            } else {
              // 아래로 스와이프 (이전 섹션)
              if (prev > secondSectionMax && prev <= thirdSectionMax) return secondSectionEnd
              if (prev > topSectionMax && prev <= secondSectionMax) return topSectionMax
            }
            return prev
          })
        }
      }
      
      touchStartRef.current = { x: 0, y: 0, time: 0 }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isGalleryHovered, sectionRanges])

  // 스크롤 히스토리 관리
  useEffect(() => {
    const history = scrollHistoryRef.current
    const lastValue = history[history.length - 1]
    if (lastValue !== scrollY) {
      history.push(scrollY)
      // 배열 길이 제한 (shift 대신 slice 사용으로 성능 개선)
      if (history.length > 10) {
        scrollHistoryRef.current = history.slice(-10)
      }
    }
  }, [scrollY])

  // 브라우저 히스토리와 동기화
  useEffect(() => {
    const handlePopState = () => {
      if (scrollHistoryRef.current.length > 1) {
        scrollHistoryRef.current.pop()
        const prevScrollY = scrollHistoryRef.current[scrollHistoryRef.current.length - 1]
        setScrollY(prevScrollY || 0)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC: 확대된 이미지 닫기
      if (e.key === 'Escape' && focusedIndex !== null) {
        setFocusedIndex(null)
        return
      }
      
      // 화살표 키: 섹션 이동 (이미지 갤러리가 포커스되지 않았을 때)
      if (focusedIndex === null && isGalleryHovered === false) {
        const { topSectionMax, secondSectionStart, secondSectionEnd, secondSectionMax, thirdSectionStart, thirdSectionEnd, thirdSectionMax } = sectionRanges
        
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setScrollY(prev => {
            if (prev > secondSectionMax && prev <= thirdSectionMax) {
              // 안녕하세요 → 어바웃
              return secondSectionEnd
            } else if (prev > topSectionMax && prev <= secondSectionMax) {
              // 어바웃 → 웰컴
              return topSectionMax
            }
            return prev
          })
          return
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setScrollY(prev => {
            if (prev < topSectionMax) {
              // 웰컴 → 어바웃
              return secondSectionStart
            } else if (prev >= secondSectionStart && prev < secondSectionMax) {
              // 어바웃 → 안녕하세요
              return thirdSectionStart
            }
            return prev
          })
          return
        } else if (e.key === 'ArrowLeft') {
          setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
          return
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex(prev => (prev + 1) % images.length)
          return
        }
      }
      
      // L: 언어 변경
      if ((e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        toggleLanguage()
      }
      // T: 테마 변경
      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, isGalleryHovered, toggleLanguage, toggleTheme, images.length, sectionRanges])

  // 공유 기능
  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast(t.linkCopied, language)
    } catch (err) {
      console.error('복사 실패:', err)
      alert('링크 복사에 실패했습니다. 브라우저를 확인해주세요.')
    }
  }, [language, t.linkCopied])

  const handleImageChange = useCallback((newIndex) => {
    setCurrentImageIndex(typeof newIndex === 'function' ? newIndex : newIndex)
  }, [])

  const handleImageFocus = useCallback((index) => {
    setFocusedIndex(index)
  }, [])

  // 첫 번째 섹션 효과
  const topSectionFadeOutEnd = sectionRanges.topSectionMax
  const topSectionFadeOutProgress = Math.max(0, Math.min(1, scrollY / topSectionFadeOutEnd))
  const topSectionScale = 1 - topSectionFadeOutProgress * 0.5
  const topSectionOpacity = 1 - topSectionFadeOutProgress
  
  // 두 번째 섹션 효과
  const { secondSectionStart, secondSectionEnd, secondSectionBufferEnd, secondSectionFadeOutEnd, thirdSectionStart, thirdSectionEnd, sectionBufferSize, transitionRange } = sectionRanges
  const secondSectionRange = secondSectionEnd - secondSectionStart
  const secondSectionProgress = scrollY < secondSectionStart 
    ? 0 
    : Math.max(0, Math.min(1, (scrollY - secondSectionStart) / secondSectionRange))
  const secondSectionFadeOutRange = secondSectionFadeOutEnd - secondSectionBufferEnd
  const secondSectionFadeOutProgress = secondSectionFadeOutRange > 0 
    ? Math.max(0, Math.min(1, (scrollY - secondSectionBufferEnd) / secondSectionFadeOutRange)) 
    : 0
  
  let secondSectionScale, secondSectionOpacity
  if (scrollY < secondSectionStart) {
    secondSectionScale = 0.5
    secondSectionOpacity = 0
  } else if (scrollY < secondSectionEnd) {
    secondSectionScale = 0.5 + secondSectionProgress * 0.5
    secondSectionOpacity = secondSectionProgress
  } else if (scrollY < secondSectionBufferEnd) {
    secondSectionScale = 1.0
    secondSectionOpacity = 1.0
  } else if (scrollY < secondSectionFadeOutEnd) {
    secondSectionScale = 1 - secondSectionFadeOutProgress * 0.5
    secondSectionOpacity = 1 - secondSectionFadeOutProgress
  } else {
    secondSectionScale = 0.5
    secondSectionOpacity = 0
  }
  
  // 세 번째 섹션 효과
  const thirdSectionBufferEnd = thirdSectionEnd + sectionBufferSize
  const thirdSectionRange = thirdSectionEnd - thirdSectionStart
  const thirdSectionProgress = thirdSectionRange > 0 
    ? Math.max(0, Math.min(1, (scrollY - thirdSectionStart) / thirdSectionRange)) 
    : 0
  
  let thirdSectionScale, thirdSectionOpacity
  if (scrollY < thirdSectionStart) {
    thirdSectionScale = 0.5
    thirdSectionOpacity = 0
  } else if (scrollY < thirdSectionEnd) {
    thirdSectionScale = 0.5 + thirdSectionProgress * 0.5
    thirdSectionOpacity = thirdSectionProgress
  } else {
    thirdSectionScale = 1.0
    thirdSectionOpacity = 1.0
  }

  // 현재 섹션 계산 (0: Welcome, 1: About, 2: Hello)
  const currentSection = useMemo(() => {
    if (scrollY < sectionRanges.topSectionMax) return 0
    if (scrollY >= sectionRanges.secondSectionStart && scrollY < sectionRanges.secondSectionFadeOutEnd) return 1
    if (scrollY >= sectionRanges.thirdSectionStart) return 2
    return 0
  }, [scrollY, sectionRanges])


  if (isOffline) {
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <OfflinePage language={language} />
      </Suspense>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Suspense fallback={null}>
          <ScrollIndicator />
          <ScrollToExplore />
          <SectionIndicator currentSection={currentSection} />
          <KeyboardShortcuts language={language} translations={translations} />
          <PerformanceMonitor />
        </Suspense>
        <ThemeToggle 
          isDarkMode={isDarkMode} 
          onToggle={toggleTheme}
          ariaLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        />
        <ShareButton 
          onShare={handleShare}
          tooltip={t.shareTooltip}
          language={language}
          ariaLabel="Share this page"
        />
        <LanguageToggle 
          language={language}
          languageChanged={languageChanged}
          onToggle={toggleLanguage}
          tooltip={t.languageTooltip}
          ariaLabel="Toggle language"
          isLanguageMismatched={isLanguageMismatched}
        />
        <main>
          {/* 첫 번째 섹션 (최상위) */}
          <div style={{ height: `${transitionRange * 2}px` }}>
            <section 
              id="top-section"
              className={`top-section ${isDarkMode ? 'dark' : 'light'} ${language === 'zh' ? 'chinese-font' : ''}`}
              style={{
                transform: `scale(${topSectionScale})`,
                opacity: topSectionOpacity,
                transformOrigin: 'center center',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform, opacity',
                pointerEvents: topSectionOpacity > 0 ? 'auto' : 'none',
                zIndex: scrollY < transitionRange ? 3 : (scrollY < transitionRange * 2 ? 2 : 1)
              }}
            >
            <div className="top-section-content">
              <div className="welcome-banner">
                {t.welcomeBanner}
              </div>
              <h1 className="top-section-title">
                {t.welcomeTitle}
              </h1>
              <h2 className="welcome-subtitle">
                {t.welcomeSubtitle} <span className="rotating-language">{rotatingLanguage}</span>
                {isRotatingTyping && <span className="typing-cursor">|</span>}
              </h2>
              <div className="welcome-quote">
                <div className="quote-header">
                  <div className="quote-line quote-line-left"></div>
                  <div className="quote-icon">"</div>
                  <div className="quote-line quote-line-right"></div>
                </div>
                <p className="quote-text">{t.welcomeQuote}</p>
              </div>
            </div>
          </section>
          </div>

          {/* 두 번째 섹션 (기존 about-section) */}
          <div style={{ height: `${transitionRange * 2}px` }}>
            <section 
            id="home" 
            className={`about-section ${isDarkMode ? 'dark' : 'light'} ${language === 'zh' ? 'chinese-font' : ''} scroll-transition-section`}
            style={{
              transform: `scale(${secondSectionScale})`,
              opacity: secondSectionOpacity,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, opacity',
              pointerEvents: secondSectionOpacity > 0 ? 'auto' : 'none',
              zIndex: (scrollY >= secondSectionStart && scrollY < secondSectionFadeOutEnd) ? 3 : 1,
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
            onClick={(e) => {
              if (focusedIndex !== null && 
                  !e.target.closest('.stack-card') && 
                  !e.target.closest('.theme-toggle') &&
                  !e.target.closest('.language-toggle') &&
                  !e.target.closest('.share-button')) {
                setFocusedIndex(null)
              }
            }}
          >
            {!isLoaded ? (
              <LoadingSkeleton />
            ) : (
            <div className="container">
              <h1 
                className={`section-title ${isLoaded ? 'fade-in-up' : ''}`}
              >
                {t.title}
              </h1>
              <p 
                className={`section-subtitle ${isLoaded ? 'fade-in-up' : ''} fade-delay-1`}
              >
                {typingText}
                {isTyping && <span className="typing-cursor" aria-hidden="true">|</span>}
              </p>
              <h2 
                className={`about-heading ${isLoaded ? 'fade-in-up' : ''} fade-delay-2`}
              >
                {t.heading}
              </h2>
              <div 
                className={`about-text ${isLoaded ? 'fade-in-up' : ''} fade-delay-3`}
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
                onMouseEnter={() => setIsGalleryHovered(true)}
                onMouseLeave={() => setIsGalleryHovered(false)}
              >
                <ImageGallery
                  images={images}
                  currentIndex={currentImageIndex}
                  onImageChange={handleImageChange}
                  onImageFocus={handleImageFocus}
                  focusedIndex={focusedIndex}
                />
              </div>
            </div>
            )}
          </section>
          </div>
          
          {/* 세 번째 섹션 */}
          <div style={{ height: `${transitionRange * 2}px` }}>
            <section 
            id="new-section"
            className={`new-section ${isDarkMode ? 'dark' : 'light'} ${language === 'zh' ? 'chinese-font' : ''}`}
            style={{
              transform: `scale(${thirdSectionScale})`,
              opacity: thirdSectionOpacity,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, opacity',
              pointerEvents: thirdSectionOpacity > 0 ? 'auto' : 'none',
              zIndex: scrollY >= thirdSectionStart ? 3 : 1,
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            <div className="new-section-content">
              <h1 
                className="new-section-title"
                style={{
                  fontSize: 'clamp(2rem, 8vw, 6rem)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  margin: 0
                }}
              >
                안녕하세요
              </h1>
            </div>
          </section>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
