import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../ThemeToggle'

describe('ThemeToggle', () => {
  it('renders correctly', () => {
    render(<ThemeToggle isDarkMode={false} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const handleToggle = vi.fn()
    render(<ThemeToggle isDarkMode={false} onToggle={handleToggle} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it('has correct aria-label for light mode', () => {
    render(<ThemeToggle isDarkMode={false} onToggle={() => {}} />)
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument()
  })

  it('has correct aria-label for dark mode', () => {
    render(<ThemeToggle isDarkMode={true} onToggle={() => {}} />)
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument()
  })
})
