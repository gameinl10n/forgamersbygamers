import { memo } from 'react'
import './OfflinePage.css'

const OfflinePage = memo(({ language }) => {
  const messages = {
    en: {
      title: 'You\'re Offline',
      message: 'It looks like you\'ve lost your internet connection.',
      suggestion: 'Please check your connection and try again.',
      reload: 'Reload Page'
    },
    ko: {
      title: '오프라인 상태',
      message: '인터넷 연결이 끊어진 것 같습니다.',
      suggestion: '연결을 확인하고 다시 시도해주세요.',
      reload: '페이지 새로고침'
    },
    zh: {
      title: '您已离线',
      message: '看起来您已失去互联网连接。',
      suggestion: '请检查您的连接并重试。',
      reload: '重新加载页面'
    }
  }

  const t = messages[language]

  return (
    <div className={`offline-page ${language === 'zh' ? 'chinese-font' : ''}`}>
      <div className="offline-content">
        <div className="offline-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#60a5fa" strokeWidth="3" />
            <line x1="30" y1="30" x2="70" y2="70" stroke="#60a5fa" strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill="#60a5fa" />
          </svg>
        </div>
        <h1 className="offline-title">{t.title}</h1>
        <p className="offline-message">{t.message}</p>
        <p className="offline-suggestion">{t.suggestion}</p>
        <button
          className="offline-reload-btn"
          onClick={() => window.location.reload()}
        >
          {t.reload}
        </button>
      </div>
    </div>
  )
})

OfflinePage.displayName = 'OfflinePage'

export default OfflinePage
