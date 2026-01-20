import { useEffect } from 'react'
import { showToast } from '../components/Toast'

/**
 * 웹사이트 보호 훅: 우클릭 방지, 개발자 도구 접근 방지, 코드 복사 방지
 * 주의: 완벽한 보호는 불가능하며, 전문가나 개발자는 우회할 수 있습니다.
 * 일반 사용자에게는 효과적입니다.
 */
export const useProtection = (language, translations) => {
  useEffect(() => {
    // 브라우저 환경이 아니면 아무 것도 하지 않음 (SSR 안전)
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const t = translations?.[language]
    let lastRightClickToast = 0
    // 우클릭 방지
    const handleContextMenu = (e) => {
      e.preventDefault()

      // 우클릭 안내 토스트 (과도한 중복 표시 방지를 위해 간단한 쿨다운 적용)
      const now = Date.now()
      if (t?.rightClickBlocked && now - lastRightClickToast > 1500) {
        showToast(t.rightClickBlocked, language)
        lastRightClickToast = now
      }

      return false
    }

    // 텍스트 선택 방지
    const handleSelectStart = (e) => {
      e.preventDefault()
      return false
    }

    // 드래그 방지
    const handleDragStart = (e) => {
      e.preventDefault()
      return false
    }

    // 복사 방지 (Ctrl+C, Ctrl+A 등)
    const handleKeyDown = (e) => {
      // 개발자 도구 단축키 방지
      if (
        // F12
        e.key === 'F12' ||
        // Ctrl+Shift+I (개발자 도구)
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        // Ctrl+Shift+J (콘솔)
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        // Ctrl+Shift+C (요소 선택)
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        // Ctrl+U (소스 보기)
        (e.ctrlKey && e.key === 'u') ||
        // Ctrl+S (저장)
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault()
        return false
      }

    }

    // 개발자 도구 감지 및 방지
    let devtoolsOpen = false
    const threshold = 160

    const detectDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true
        }
      } else {
        devtoolsOpen = false
      }
    }

    // 주기적으로 개발자 도구 감지
    const devToolsInterval = setInterval(detectDevTools, 500)

    // 이벤트 리스너 등록
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    // CSS로 추가 보호
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
      }
      
      /* 이미지 갤러리는 pointer-events를 유지해야 함 */
      .stack-gallery,
      .stack-card,
      .about-image-container {
        pointer-events: auto !important;
      }
    `
    document.head.appendChild(style)

    // 정리 함수
    return () => {
      clearInterval(devToolsInterval)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
      document.head.removeChild(style)
    }
  }, [])
}
