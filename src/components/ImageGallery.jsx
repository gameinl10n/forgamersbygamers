import { memo, useRef, useState, useEffect, useCallback } from 'react'
import './ImageGallery.css'

const ImageGallery = memo(({ images, currentIndex, onImageChange, onImageFocus, focusedIndex }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [stackOffset, setStackOffset] = useState(0)
  const [stackOffsetY, setStackOffsetY] = useState(0)
  const [imageLoading, setImageLoading] = useState(() => {
    const loading = {}
    for (let i = 0; i < images.length; i++) {
      loading[i] = true // 초기값을 true로 설정 (로딩 중으로 시작)
    }
    return loading
  })
  const dragStartRef = useRef(0)
  const dragStartYRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const stackRef = useRef(null)
  const imgRefs = useRef({})

  const startDrag = useCallback((clientX, clientY) => {
    if (focusedIndex !== null) return
    setIsDragging(true)
    dragStartRef.current = clientX
    dragStartYRef.current = clientY
    currentOffsetRef.current = 0
    hasDraggedRef.current = false
  }, [focusedIndex])

  const handleStackMouseDown = useCallback((e) => {
    startDrag(e.clientX, e.clientY)
  }, [startDrag])

  const handleWheel = useCallback((e) => {
    if (focusedIndex !== null) return
    e.preventDefault()
    e.stopPropagation()
    const deltaY = e.deltaY
    if (deltaY > 0) {
      onImageChange((prev) => (prev + 1) % images.length)
    } else if (deltaY < 0) {
      onImageChange((prev) => (prev - 1 + images.length) % images.length)
    }
  }, [focusedIndex, images.length, onImageChange])

  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging) return
    const dx = clientX - dragStartRef.current
    const dy = clientY - dragStartYRef.current
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDraggedRef.current = true
    }
    
    currentOffsetRef.current = dx
    setStackOffset(dx)
    setStackOffsetY(dy)
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    const threshold = 15
    const currentOffset = currentOffsetRef.current
    
    if (currentOffset > threshold) {
      onImageChange((prev) => (prev + 1) % images.length)
    } else if (currentOffset < -threshold) {
      onImageChange((prev) => (prev - 1 + images.length) % images.length)
    }
    
    setIsDragging(false)
    setStackOffset(0)
    setStackOffsetY(0)
    currentOffsetRef.current = 0
    
    setTimeout(() => {
      hasDraggedRef.current = false
    }, 100)
  }, [isDragging, images.length, onImageChange])

  useEffect(() => {
    if (!isDragging) return

    const mouseMove = (e) => handleMove(e.clientX, e.clientY)
    const mouseUp = () => handleDragEnd()
    const touchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)
    const touchEnd = () => handleDragEnd()

    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)
    window.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('touchend', touchEnd)
    
    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseup', mouseUp)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
    }
  }, [isDragging, handleMove, handleDragEnd])

  // 이미지가 이미 로드되어 있는지 확인 (캐시된 경우)
  useEffect(() => {
    const checkCachedImages = () => {
      Object.keys(imgRefs.current).forEach(index => {
        const imgEl = imgRefs.current[index]
        if (imgEl?.complete && imgEl.naturalHeight !== 0) {
          setImageLoading(prev => {
            if (prev[index] !== false) {
              return { ...prev, [index]: false }
            }
            return prev
          })
        }
      })
    }
    
    // 즉시 확인하고, 다음 프레임에서도 확인 (이미지가 아직 마운트되지 않았을 수 있음)
    checkCachedImages()
    const rafId = requestAnimationFrame(checkCachedImages)
    return () => cancelAnimationFrame(rafId)
  }, [images])

  return (
    <div 
      ref={stackRef}
      className="stack-gallery"
      onMouseDown={handleStackMouseDown}
      onWheel={handleWheel}
      onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      role="region"
      aria-label="Image gallery"
    >
      {images.map((img, index) => {
        const offset = index - currentIndex
        const isActive = index === currentIndex
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
                onImageFocus(null)
              } else {
                onImageFocus(index)
                onImageChange(index)
              }
            }}
            role="button"
            tabIndex={isActive ? 0 : -1}
            aria-label={`Image ${index + 1} of ${images.length}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (focusedIndex === index) {
                  onImageFocus(null)
                } else {
                  onImageFocus(index)
                  onImageChange(index)
                }
              }
            }}
          >
            <div className="about-image-container">
              {imageLoading[index] === true && (
                <div className="image-loading" role="status" aria-label="Loading image">
                  <div className="loading-spinner"></div>
                </div>
              )}
              {imageLoading[index] === 'error' && (
                <div className="image-error" role="alert" aria-label="Image failed to load">
                  <p>이미지를 불러올 수 없습니다</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setImageLoading(prev => ({ ...prev, [index]: true }))
                      const imgElement = e.target.closest('.about-image-container').querySelector('img')
                      if (imgElement) {
                        imgElement.src = imgElement.src + '?retry=' + Date.now()
                      }
                    }}
                    className="image-retry-btn"
                  >
                    다시 시도
                  </button>
                </div>
              )}
              <img 
                ref={(el) => {
                  if (el) {
                    imgRefs.current[index] = el
                    // 이미지가 이미 로드되어 있으면 즉시 표시
                    if (el.complete && el.naturalHeight !== 0) {
                      setImageLoading(prev => {
                        if (prev[index] !== false) {
                          return { ...prev, [index]: false }
                        }
                        return prev
                      })
                    }
                  } else {
                    delete imgRefs.current[index]
                  }
                }}
                src={typeof img === 'string' ? img : (img.src || img.fallback)}
                alt={`BYEONGUK ${index + 1}`}
                draggable={false}
                loading={index > 2 ? "lazy" : "eager"}
                decoding="async"
                fetchpriority={index === currentIndex ? "high" : "low"}
                onLoad={() => {
                  setImageLoading(prev => ({ ...prev, [index]: false }))
                }}
                onError={(e) => {
                  // 이미지 로드 실패 시 fallback 이미지로 전환
                  const currentImg = typeof img === 'string' ? img : img
                  if (typeof currentImg === 'object' && currentImg.fallback && e.target.src !== currentImg.fallback) {
                    e.target.src = currentImg.fallback
                    return
                  }
                  setImageLoading(prev => ({ ...prev, [index]: 'error' }))
                }}
                style={{ 
                  opacity: imageLoading[index] === false ? 1 : 0,
                  transition: 'opacity 0.3s ease-out',
                  display: imageLoading[index] === 'error' ? 'none' : 'block'
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
})

ImageGallery.displayName = 'ImageGallery'

export default ImageGallery
