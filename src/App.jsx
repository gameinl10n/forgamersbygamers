import { useEffect, useState, useCallback } from 'react'
import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'
import { useTypingText } from './hooks/useTypingText'
import { useSEO } from './hooks/useSEO'
import { useStructuredData } from './hooks/useStructuredData'
import { useAnalytics } from './hooks/useAnalytics'
import { useWebVitals } from './hooks/useWebVitals'
import { useLanguageRouting } from './hooks/useLanguageRouting'
import { useOffline } from './hooks/useOffline'
import { translations, images } from './utils/translations'
import ThemeToggle from './components/ThemeToggle'
import LanguageToggle from './components/LanguageToggle'
import ShareButton from './components/ShareButton'
import ImageGallery from './components/ImageGallery'
import ErrorBoundary from './components/ErrorBoundary'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import OfflinePage from './components/OfflinePage'
import ScrollIndicator from './components/ScrollIndicator'
import LoadingSkeleton from './components/LoadingSkeleton'
import { showToast } from './components/Toast'
import './styles/variables.css'
import './styles/animations.css'
import './App.css'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()
  const { language, toggleLanguage, languageChanged } = useLanguage()
  const [scrollY, setScrollY] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(2)
  const [focusedIndex, setFocusedIndex] = useState(null)
  
  const t = translations[language]
  const { typingText, isTyping } = useTypingText(t.subtitle)
  
  const isOffline = useOffline()
  
  useSEO(language)
  useStructuredData(language)
  useAnalytics()
  useWebVitals()
  useLanguageRouting()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
  }, [focusedIndex, toggleLanguage, toggleTheme])

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
    setCurrentImageIndex(typeof newIndex === 'function' ? newIndex : () => newIndex)
  }, [])

  const handleImageFocus = useCallback((index) => {
    setFocusedIndex(index)
  }, [])

  if (isOffline) {
    return <OfflinePage language={language} />
  }

  return (
    <ErrorBoundary>
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <ScrollIndicator />
        <KeyboardShortcuts language={language} translations={translations} />
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
        />
        <main>
          <section 
            id="home" 
            className={`about-section ${isDarkMode ? 'dark' : 'light'} ${language === 'zh' ? 'chinese-font' : ''}`}
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
                style={{
                  transform: `translateY(${-scrollY * 0.1}px)`
                }}
              >
                {t.title}
              </h1>
              <p 
                className={`section-subtitle ${isLoaded ? 'fade-in-up' : ''} fade-delay-1`}
                style={{
                  transform: `translateY(${-scrollY * 0.08}px)`
                }}
              >
                {typingText}
                {isTyping && <span className="typing-cursor" aria-hidden="true">|</span>}
              </p>
              <h2 
                className={`about-heading ${isLoaded ? 'fade-in-up' : ''} fade-delay-2`}
                style={{
                  transform: `translateY(${-scrollY * 0.08}px)`
                }}
              >
                {t.heading}
              </h2>
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
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
