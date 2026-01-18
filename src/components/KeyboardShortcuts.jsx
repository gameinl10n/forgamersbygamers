import { memo, useState, useEffect } from 'react'
import './KeyboardShortcuts.css'

const KeyboardShortcuts = memo(({ language, translations }) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ? 키로 도움말 열기/닫기
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setIsOpen(prev => !prev)
      }
      // ESC로 닫기
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const shortcuts = {
    en: [
      { key: '↑ / ↓', description: 'Navigate sections' },
      { key: 'L', description: 'Change language' },
      { key: 'T', description: 'Toggle theme' },
      { key: '← / →', description: 'Navigate images' },
      { key: 'ESC', description: 'Close focused image' },
      { key: '?', description: 'Show/hide this help' }
    ],
    ko: [
      { key: '↑ / ↓', description: '섹션 간 이동' },
      { key: 'L', description: '언어 변경' },
      { key: 'T', description: '테마 변경' },
      { key: '← / →', description: '이미지 넘기기' },
      { key: 'ESC', description: '확대된 이미지 닫기' },
      { key: '?', description: '도움말 표시/숨기기' }
    ],
    zh: [
      { key: '↑ / ↓', description: '切换部分' },
      { key: 'L', description: '更改语言' },
      { key: 'T', description: '切换主题' },
      { key: '← / →', description: '切换图片' },
      { key: 'ESC', description: '关闭放大图片' },
      { key: '?', description: '显示/隐藏帮助' }
    ]
  }

  if (!isOpen) return null

  return (
    <div 
      className="keyboard-shortcuts-overlay"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={language === 'en' ? 'Keyboard shortcuts' : language === 'ko' ? '키보드 단축키' : '键盘快捷键'}
    >
      <div 
        className={`keyboard-shortcuts-modal ${language === 'zh' ? 'chinese-font' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="keyboard-shortcuts-header">
          <h2>
            {language === 'en' ? 'Keyboard Shortcuts' : language === 'ko' ? '키보드 단축키' : '键盘快捷键'}
          </h2>
          <button
            className="keyboard-shortcuts-close"
            onClick={() => setIsOpen(false)}
            aria-label={language === 'en' ? 'Close' : language === 'ko' ? '닫기' : '关闭'}
          >
            ×
          </button>
        </div>
        <div className="keyboard-shortcuts-list">
          {shortcuts[language].map((shortcut, index) => (
            <div key={index} className="keyboard-shortcut-item">
              <kbd className="keyboard-shortcut-key">{shortcut.key}</kbd>
              <span className="keyboard-shortcut-desc">{shortcut.description}</span>
            </div>
          ))}
        </div>
        <div className="keyboard-shortcuts-footer">
          <button
            className="keyboard-shortcuts-close-btn"
            onClick={() => setIsOpen(false)}
          >
            {language === 'en' ? 'Close' : language === 'ko' ? '닫기' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  )
})

KeyboardShortcuts.displayName = 'KeyboardShortcuts'

export default KeyboardShortcuts
