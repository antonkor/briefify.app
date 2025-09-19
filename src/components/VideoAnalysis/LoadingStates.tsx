'use client'

import { useState } from 'react'

interface LoadingStatesProps {
  isLoading: boolean
  loadingText: string
  loadingStage: 'idle' | 'fetching' | 'hero' | 'insights' | 'comments' | 'complete'
  isWorkshopMode?: boolean
  heroTexts?: string[]
  heroTextIndex?: number
}

export function LoadingStates({
  isLoading,
  loadingText,
  loadingStage,
  isWorkshopMode = false,
  heroTexts = [
    "Extract key insights in seconds",
    "Discover hidden gems instantly",
    "Transform content into knowledge",
    "Uncover meaningful discussions",
    "Filter signal from noise"
  ],
  heroTextIndex = 0
}: LoadingStatesProps) {
  const [isHoveringLoader, setIsHoveringLoader] = useState(false)

  if (!isLoading) {
    return (
      <div className="py-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 transition-all duration-500">
            {heroTexts[heroTextIndex]}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div
        className="text-gray-500 dark:text-gray-400 text-sm font-mono transition-all duration-300"
        style={{ marginLeft: '2px' }}
        onMouseEnter={() => setIsHoveringLoader(true)}
        onMouseLeave={() => setIsHoveringLoader(false)}
      >
        {(loadingText === "..." || (isWorkshopMode && loadingStage === 'idle')) ? (
          <div className="flex items-center justify-center space-x-0">
            <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0s' }}>.</span>
            <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.3s' }}>.</span>
            <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.6s' }}>.</span>
          </div>
        ) : (
          <div className="text-center">
            {loadingText}
          </div>
        )}
      </div>

      {/* Loading Stage Indicator */}
      {isHoveringLoader && loadingStage !== 'idle' && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          Stage: {loadingStage}
        </div>
      )}
    </div>
  )
}

// Loading Messages Hook
export function useLoadingMessages() {
  const messages = [
    "Validating URL...",
    "Fetching video data...",
    "Reading page content...",
    "Analyzing transcript...",
    "Processing comments...",
    "Creating summaries...",
    "Extracting insights...",
    "Finalizing results..."
  ]

  const getMessageForStage = (stage: string): string => {
    switch (stage) {
      case 'fetching':
        return messages[1]
      case 'hero':
        return messages[3]
      case 'insights':
        return messages[6]
      case 'comments':
        return messages[4]
      case 'complete':
        return messages[7]
      default:
        return messages[0]
    }
  }

  return { messages, getMessageForStage }
}