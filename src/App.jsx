import { useEffect, useState } from 'react'
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
    ending2: 'not merely as a job.',
    imageFallback: 'Please place your photo here'
  },
  ko: {
    title: '변영욱에 대해',
    subtitle: '나의 조용한 이야기를 펼쳐가며',
    heading: '현지화 전문가는 단순한 번역가가 아닙니다',
    paragraph: '언어, 문화, 사회, 정치, 예술에 대한 이해를 바탕으로 작품의 완성도를 극대화하는 최종 문화 검수자로서의 역할을 수행합니다.',
    language: '언어',
    culture: '문화',
    society: '사회',
    politics: '정치',
    arts: '예술',
    gamer: '게이머',
    ending: '단순한 직업이 아닌',
    ending2: '게이머로서 사용자에게 다가가려고 노력합니다.',
    imageFallback: '사진을 여기에 넣어주세요'
  },
  zh: {
    title: '关于边英旭',
    subtitle: '展开我安静的故事',
    heading: '本地化专家不仅仅是翻译',
    paragraph: '作为最终的文化审查者，通过利用对语言、文化、社会、政治和艺术的理解，最大化作品的完整性。我试图以游戏玩家的身份接触用户，而不仅仅是作为一份工作。',
    language: '语言',
    culture: '文化',
    society: '社会',
    politics: '政治',
    arts: '艺术',
    gamer: '游戏玩家',
    ending: '我试图以',
    ending2: '游戏玩家的身份接触用户，而不仅仅是作为一份工作。',
    imageFallback: '请在此处放置您的照片'
  }
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev === 'en') return 'ko'
      if (prev === 'ko') return 'zh'
      return 'en'
    })
  }

  const t = translations[language]

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        <svg className="theme-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
          {/* 언덕 */}
          <path
            className="hill"
            d="M0 100 Q50 80, 100 100 T200 100 L200 120 L0 120 Z"
            fill={isDarkMode ? "#1a1a2e" : "#4a7c59"}
          />
          
          {/* 해 */}
          <circle
            className={`sun ${isDarkMode ? 'hidden' : 'visible'}`}
            cx="50"
            cy="40"
            r="20"
            fill="#ffd700"
          />
          
          {/* 달 */}
          <g className={`moon ${isDarkMode ? 'visible' : 'hidden'}`}>
            <circle cx="150" cy="30" r="18" fill="#f0f0f0" />
            <circle cx="145" cy="25" r="15" fill={isDarkMode ? "#1a1a2e" : "#f0f0f0"} />
          </g>
          
          {/* 별들 */}
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
      <button className="language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
        <div className="language-tooltip">
          EN - KO - ZH 순서로 언어가 순환됩니다. 표시 언어를 바꾸고 싶으면 버튼을 눌러주세요
        </div>
        <svg className="language-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* 별들 */}
          <circle className="lang-star star-1" cx="20" cy="30" r="3" fill="#ffd700" />
          <circle className="lang-star star-2" cx="50" cy="20" r="2.5" fill="#ffd700" />
          <circle className="lang-star star-3" cx="80" cy="30" r="3" fill="#ffd700" />
          <circle className="lang-star star-4" cx="30" cy="60" r="2.5" fill="#ffd700" />
          <circle className="lang-star star-5" cx="70" cy="60" r="2.5" fill="#ffd700" />
          <circle className="lang-star star-6" cx="50" cy="70" r="2.5" fill="#ffd700" />
          
          {/* 언어 텍스트 */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontWeight="bold"
            fill="#ffd700"
            className="language-text"
          >
            {language.toUpperCase()}
          </text>
        </svg>
      </button>
      <main>
        <section id="home" className={`about-section ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="container">
            <h2 className={`section-title ${isLoaded ? 'fade-in-up' : ''}`}>
              {t.title}
            </h2>
            <p className={`section-subtitle ${isLoaded ? 'fade-in-up' : ''} fade-delay-1`}>
              {t.subtitle}
            </p>
            <h3 className={`about-heading ${isLoaded ? 'fade-in-up' : ''} fade-delay-2`}>
              {t.heading}
            </h3>
            <div className={`about-text ${isLoaded ? 'fade-in-up' : ''} fade-delay-3`}>
              <p className="about-paragraph">
                {language === 'en' ? (
                  <>
                    {t.paragraph}{' '}
                    <span className="highlight">{t.language}</span>, <span className="highlight">{t.culture}</span>,{' '}
                    <span className="highlight">{t.society}</span>, <span className="highlight">{t.politics}</span>, and{' '}
                    <span className="highlight">{t.arts}</span>. {t.ending}{' '}
                    <span className="highlight">{t.gamer}</span>, {t.ending2}
                  </>
                ) : (
                  <>
                    {t.paragraph}
                  </>
                )}
              </p>
            </div>
            <div className={`about-image-wrapper ${isLoaded ? 'fade-in-up' : ''} fade-delay-4`}>
              <div className="about-image-container">
                <img 
                  src="/images/profile.jpg" 
                  alt="BYEONGUK"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="image-fallback">
                  <span>{t.imageFallback}</span>
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

