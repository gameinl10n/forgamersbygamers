import { useState, useEffect, useRef } from 'react'

const LANGUAGES = ['Localization', 'Translation', 'Game', 'Programming', 'Writing', 'Editing']

export const useRotatingTyping = (typingSpeed = 80, deletingSpeed = 50, deleteDelay = 2000) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const isDeletingRef = useRef(false)
  const languageIndexRef = useRef(0)
  const typingIndexRef = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const typeText = () => {
      const currentLanguage = LANGUAGES[languageIndexRef.current]
      
      if (isDeletingRef.current) {
        // 지우는 중
        if (typingIndexRef.current > 0) {
          setDisplayedText(currentLanguage.slice(0, typingIndexRef.current - 1))
          typingIndexRef.current--
          setIsTyping(true)
          timeoutRef.current = setTimeout(typeText, deletingSpeed)
        } else {
          // 지우기 완료, 다음 언어로
          isDeletingRef.current = false
          languageIndexRef.current = (languageIndexRef.current + 1) % LANGUAGES.length
          typingIndexRef.current = 0
          setDisplayedText('')
          timeoutRef.current = setTimeout(typeText, 300)
        }
      } else {
        // 타이핑 중
        if (typingIndexRef.current < currentLanguage.length) {
          setDisplayedText(currentLanguage.slice(0, typingIndexRef.current + 1))
          typingIndexRef.current++
          setIsTyping(true)
          timeoutRef.current = setTimeout(typeText, typingSpeed)
        } else {
          // 타이핑 완료
          // 커서가 문장 끝에서 계속 깜빡이도록 유지
          setIsTyping(true)
          timeoutRef.current = setTimeout(() => {
            // 일정 시간 대기 후 지우기 시작
            isDeletingRef.current = true
            typeText()
          }, deleteDelay)
        }
      }
    }

    typeText()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [typingSpeed, deletingSpeed, deleteDelay])

  return { displayedText, isTyping }
}

export default useRotatingTyping