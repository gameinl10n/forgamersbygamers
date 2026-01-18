// Toast utility - no React imports needed

export const showToast = (message, language = 'en') => {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.setAttribute('role', 'alert')
  toast.setAttribute('aria-live', 'polite')
  
  const screenWidth = window.innerWidth
  let fontSize = '0.75rem'
  if (screenWidth < 480) {
    fontSize = '0.65rem'
  } else if (screenWidth < 768) {
    fontSize = '0.7rem'
  }
  
  const fontFamily = language === 'zh' 
    ? '"Microsoft Yahei", "NEXONLv1GothicLight", sans-serif'
    : '"NEXONLv1GothicLight", sans-serif'
  
  toast.style.cssText = `position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: white; padding: 1rem 3rem; border-radius: 25px; z-index: 10000; animation: fadeInUp 0.3s ease-out; font-family: ${fontFamily}; font-size: ${fontSize}; white-space: nowrap; max-width: calc(100vw - 2rem); overflow: hidden; text-overflow: ellipsis;`
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out'
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 2000)
}
