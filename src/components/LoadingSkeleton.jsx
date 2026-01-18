import { memo } from 'react'
import './LoadingSkeleton.css'

const LoadingSkeleton = memo(() => {
  return (
    <div className="loading-skeleton" aria-label="Loading content">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
      <div className="skeleton-heading" />
      <div className="skeleton-text">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line skeleton-line-short" />
      </div>
      <div className="skeleton-image" />
    </div>
  )
})

LoadingSkeleton.displayName = 'LoadingSkeleton'

export default LoadingSkeleton
