import { useState, useEffect } from 'react'

export const useTypingText = (text, speed = 50) => {
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) return

    let currentIndex = 0
    setIsTyping(true)
    setTypingText('')

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setTypingText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, speed)

    return () => clearInterval(typeInterval)
  }, [text, speed])

  return { typingText, isTyping }
}
