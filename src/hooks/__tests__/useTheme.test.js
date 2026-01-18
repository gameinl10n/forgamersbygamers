import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns default dark mode when no saved preference', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.isDarkMode).toBe(true)
  })

  it('loads saved theme from localStorage', () => {
    localStorage.setItem('darkMode', 'false')
    const { result } = renderHook(() => useTheme())
    expect(result.current.isDarkMode).toBe(false)
  })

  it('toggles theme and saves to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.isDarkMode).toBe(false)
    expect(localStorage.getItem('darkMode')).toBe('false')
  })
})
