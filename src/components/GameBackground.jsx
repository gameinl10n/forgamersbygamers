import { useEffect, useState, useRef, useMemo } from 'react'
import './GameBackground.css'

const GameBackground = ({ isDarkMode = true }) => {
  const [characterPosition, setCharacterPosition] = useState({ x: 20, y: 20 })
  const [characterDirection, setCharacterDirection] = useState(0)
  const [isEating, setIsEating] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(true) // 팩맨 입 애니메이션용
  const eatenPelletsRef = useRef(new Set())
  const animationRef = useRef(null)
  const mouthAnimationRef = useRef(null)

  // 펠렛 초기화 - 간단하게
  const pellets = useMemo(() => {
    const initialPellets = []
    const gridSize = 100
    const cols = Math.ceil(window.innerWidth / gridSize)
    const rows = Math.ceil(window.innerHeight / gridSize)

    for (let i = 1; i < rows - 1; i++) {
      for (let j = 1; j < cols - 1; j++) {
        if ((i + j) % 3 === 0) {
          initialPellets.push({
            id: `${i}-${j}`,
            x: j * gridSize,
            y: i * gridSize
          })
        }
      }
    }
    return initialPellets
  }, [])

  // 팩맨 입 애니메이션 - 이동할 때마다 입이 열렸다 닫혔다 함 (더 빠르고 강하게)
  useEffect(() => {
    const animateMouth = () => {
      setMouthOpen(prev => !prev)
    }
    
    mouthAnimationRef.current = setInterval(animateMouth, 120) // 더 빠르게
    
    return () => {
      if (mouthAnimationRef.current) clearInterval(mouthAnimationRef.current)
    }
  }, [])

  // 캐릭터 이동
  useEffect(() => {
    const moveCharacter = () => {
      setCharacterPosition(prev => {
        const speed = 0.3
        let newX = prev.x
        let newY = prev.y

        switch (characterDirection) {
          case 0: // right
            newX = Math.min(90, prev.x + speed)
            if (newX >= 90) setCharacterDirection(90)
            break
          case 90: // down
            newY = Math.min(90, prev.y + speed)
            if (newY >= 90) setCharacterDirection(180)
            break
          case 180: // left
            newX = Math.max(10, prev.x - speed)
            if (newX <= 10) setCharacterDirection(270)
            break
          case 270: // up
            newY = Math.max(10, prev.y - speed)
            if (newY <= 10) setCharacterDirection(0)
            break
        }

        // 펠렛 먹기 체크
        const charX = (newX / 100) * window.innerWidth
        const charY = (newY / 100) * window.innerHeight

        for (const pellet of pellets) {
          if (eatenPelletsRef.current.has(pellet.id)) continue
          
          const dist = Math.sqrt(
            Math.pow(charX - pellet.x, 2) + Math.pow(charY - pellet.y, 2)
          )
          
          if (dist < 40) {
            eatenPelletsRef.current.add(pellet.id)
            setIsEating(true)
            setTimeout(() => setIsEating(false), 200)
            break
          }
        }

        if (Math.random() < 0.01) {
          const dirs = [0, 90, 180, 270]
          setCharacterDirection(dirs[Math.floor(Math.random() * dirs.length)])
        }

        return { x: newX, y: newY }
      })
    }

    animationRef.current = setInterval(moveCharacter, 50)

    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [characterDirection, pellets])

  return (
    <div 
      className="game-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
        transition: 'background-color 0.5s ease-out'
      }}
    >
      {/* 미로 배경 - 팩맨 스타일 격자 미로 */}
      <svg 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: isDarkMode ? 0.5 : 0.4,
          zIndex: 1
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern 
            id={`maze-pattern-${isDarkMode ? 'dark' : 'light'}`}
            x="0" 
            y="0" 
            width="20" 
            height="20" 
            patternUnits="userSpaceOnUse"
          >
            {/* 팩맨 스타일 미로 - 격자 형태의 명확한 벽 */}
            {/* 외곽 벽 - 두꺼운 벽 */}
            <rect x="0" y="0" width="20" height="3" fill={isDarkMode ? "rgba(96, 165, 250, 0.6)" : "rgba(59, 130, 246, 0.5)"} />
            <rect x="0" y="0" width="3" height="20" fill={isDarkMode ? "rgba(96, 165, 250, 0.6)" : "rgba(59, 130, 246, 0.5)"} />
            <rect x="17" y="0" width="3" height="20" fill={isDarkMode ? "rgba(96, 165, 250, 0.6)" : "rgba(59, 130, 246, 0.5)"} />
            <rect x="0" y="17" width="20" height="3" fill={isDarkMode ? "rgba(96, 165, 250, 0.6)" : "rgba(59, 130, 246, 0.5)"} />
            
            {/* 내부 벽들 - 팩맨 미로 패턴 */}
            <rect x="8" y="0" width="4" height="10" fill={isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.4)"} />
            <rect x="0" y="8" width="10" height="4" fill={isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.4)"} />
            <rect x="10" y="8" width="10" height="4" fill={isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.4)"} />
            <rect x="8" y="10" width="4" height="10" fill={isDarkMode ? "rgba(96, 165, 250, 0.5)" : "rgba(59, 130, 246, 0.4)"} />
            
            {/* 추가 경로 벽 */}
            <rect x="4" y="4" width="12" height="2" fill={isDarkMode ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.3)"} />
            <rect x="4" y="14" width="12" height="2" fill={isDarkMode ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.3)"} />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#maze-pattern-${isDarkMode ? 'dark' : 'light'})`} />
      </svg>

      {/* 펠렛들 - 다크모드에 따라 색상 변경 */}
      {pellets.filter(p => !eatenPelletsRef.current.has(p.id)).map(pellet => (
        <div
          key={pellet.id}
          style={{
            position: 'absolute',
            left: `${pellet.x}px`,
            top: `${pellet.y}px`,
            width: '6px',
            height: '6px',
            background: isDarkMode ? '#FFD700' : '#FFA500',
            borderRadius: '50%',
            boxShadow: isDarkMode 
              ? '0 0 8px rgba(255, 215, 0, 0.8)' 
              : '0 0 8px rgba(255, 165, 0, 0.8)',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            opacity: isDarkMode ? 0.6 : 0.7
          }}
        />
      ))}

      {/* 게임 캐릭터 - 팩맨 스타일 입 애니메이션 */}
      <div
        style={{
          position: 'absolute',
          left: `${characterPosition.x}%`,
          top: `${characterPosition.y}%`,
          width: '30px',
          height: '30px',
          transform: `translate(-50%, -50%) rotate(${characterDirection}deg)`,
          zIndex: 3,
          filter: isDarkMode 
            ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 1))'
            : 'drop-shadow(0 0 6px rgba(255, 165, 0, 0.9))',
          transition: 'transform 0.1s linear'
        }}
      >
        <svg viewBox="0 0 24 24" width="30" height="30">
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            fill={isDarkMode ? "#FFD700" : "#FFA500"} 
          />
          {/* 팩맨 입 - 더 크게 벌어졌다 닫혔다 (팩맨 스타일) */}
          <path
            d={
              isEating 
                ? "M 12 12 L 12 2 A 10 10 0 0 1 23 12 Z" // 먹을 때: 최대한 열림
                : mouthOpen 
                  ? "M 12 12 L 12 2 A 10 10 0 0 1 21 12 Z" // 열림 (더 크게)
                  : "M 12 12 L 12 2 A 10 10 0 0 1 16 12 Z" // 닫힘 (거의 닫힘)
            }
            fill={isDarkMode ? "#2a2a2a" : "#f5f5f5"}
            style={{
              transition: 'd 0.12s ease-in-out'
            }}
          />
        </svg>
      </div>
    </div>
  )
}

export default GameBackground
