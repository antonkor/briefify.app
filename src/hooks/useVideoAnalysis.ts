import { useState } from 'react'
import { loadSampleVideoData, getRandomSampleVideo } from '@/utils/sampleData'
import { logger } from '@/config/dev'

/**
 * Custom hook for managing video analysis state and operations
 * Handles video loading, loading stages, insights, and related UI state
 */
export const useVideoAnalysis = () => {
  // Core video state
  const [isLoading, setIsLoading] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [loadingText, setLoadingText] = useState("...")
  const [error, setError] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState('idle') // idle, fetching, hero, insights, comments, complete

  // Insights state
  const [visibleInsights, setVisibleInsights] = useState(3)
  const [showAISummary, setShowAISummary] = useState(false)

  // UI state
  const [containerHeight, setContainerHeight] = useState('auto')

  // Workshop mode loading function
  const loadVideoInWorkshopMode = async (url: string) => {
    setShowAISummary(false)
    setVisibleInsights(3)

    try {
      const data = await getRandomSampleVideo()
      setVideoData(data)
      logger.dev('Sample video data loaded for workshop mode')
    } catch (error) {
      logger.error('Error loading video data in workshop mode:', error)
      throw error
    }
  }

  // Normal mode loading function with stage progression
  const loadVideoInNormalMode = async (url: string, trackEvent: Function) => {
    setIsLoading(true)
    setError(null)
    setLoadingStage('fetching')
    setLoadingText("Fetching video data...")
    setVideoData(null) // Clear any existing data

    try {
      // Stage 1: Fetching
      setTimeout(async () => {
        setLoadingStage('hero')
        setLoadingText("Processing video metadata...")

        // Load video data during hero stage
        try {
          const data = await loadSampleVideoData()
          const randomVideo = data[Math.floor(Math.random() * data.length)]
          setVideoData(randomVideo)
        } catch (error) {
          logger.error('Error loading video data in hero stage:', error)
        }
      }, 1200)

      // Stage 2: Insights
      setTimeout(() => {
        setLoadingStage('insights')
        setLoadingText("Extracting key insights...")
      }, 2800)

      // Stage 3: Insights
      setTimeout(() => {
        setLoadingStage('comments')
        setLoadingText("Analyzing community discussions...")
      }, 4500)

      // Stage 4: Complete
      setTimeout(() => {
        setLoadingStage('complete')
        setIsLoading(false)
        setLoadingText("Analysis complete!")

        trackEvent('analysis_completed', {
          url: url,
          success: true,
          duration: 6000
        })
      }, 6200)

    } catch (error) {
      console.error('Loading error:', error)
      setError('Failed to load video data. Please try again.')
      setIsLoading(false)
      setLoadingStage('idle')

      trackEvent('analysis_failed', {
        url: url,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Insights management
  const loadMoreInsights = () => {
    if (visibleInsights >= allInsights.length) return

    const newCount = Math.min(visibleInsights + 3, allInsights.length)
    // trackEvent('insights_expanded', {
    //   from: visibleInsights,
    //   to: newCount,
    //   total: allInsights.length
    // })
    setVisibleInsights(newCount)
  }

  const toggleAISummary = () => {
    if (showAISummary) {
      setShowAISummary(false)
      setVisibleInsights(3)
      // trackEvent('ai_summary_hidden')
    } else {
      setShowAISummary(true)
      // trackEvent('ai_summary_shown')
    }
  }

  // Workshop mode navigation
  const nextStage = () => {
    const stages = ['idle', 'fetching', 'hero', 'insights', 'comments', 'complete']
    const currentIndex = stages.indexOf(loadingStage)
    if (currentIndex < stages.length - 1) {
      setLoadingStage(stages[currentIndex + 1])
    }
  }

  const prevStage = () => {
    const stages = ['idle', 'fetching', 'hero', 'insights', 'comments', 'complete']
    const currentIndex = stages.indexOf(loadingStage)
    if (currentIndex > 0) {
      setLoadingStage(stages[currentIndex - 1])
    }
  }

  const resetAnimation = () => {
    setLoadingStage('idle')
    setVisibleInsights(3)
    setShowAISummary(false)
  }

  const goToBeginning = () => {
    setLoadingStage('idle')
    setVideoData(null)
    setVisibleInsights(3)
    setShowAISummary(false)
    setIsLoading(false)
  }

  const goToEnd = () => {
    setLoadingStage('complete')
    setIsLoading(false)
    if (!videoData) {
      // Load data if not already loaded
      getRandomSampleVideo().then(data => {
        setVideoData(data)
      }).catch(error => {
        logger.error('Error loading video data for end state:', error)
      })
    }
  }

  // New URL analysis
  const analyzeNewUrl = async (newUrl: string, trackEvent: Function) => {
    if (!newUrl.trim()) return

    // Reset all states
    setVideoData(null)
    setVisibleInsights(3)
    setShowAISummary(false)
    setLoadingStage('fetching')
    setIsLoading(true)
    setLoadingText("Fetching video data...")

    try {
      const data = await getRandomSampleVideo()

      setTimeout(() => {
        setVideoData(data)
        setLoadingStage('complete')
        setIsLoading(false)
        setLoadingText("Analysis complete!")

        trackEvent('new_url_analyzed', {
          url: newUrl,
          success: true
        })
      }, 2000)

    } catch (error) {
      logger.error('Error loading video data in handleNewUrl:', error)
      setError('Failed to analyze new URL. Please try again.')
      setIsLoading(false)
      setLoadingStage('idle')

      trackEvent('new_url_failed', {
        url: newUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return {
    // State
    isLoading,
    videoData,
    loadingText,
    error,
    loadingStage,
    visibleInsights,
    showAISummary,
    containerHeight,

    // Actions
    loadVideoInWorkshopMode,
    loadVideoInNormalMode,
    loadMoreInsights,
    toggleAISummary,
    nextStage,
    prevStage,
    resetAnimation,
    goToBeginning,
    goToEnd,
    analyzeNewUrl,

    // Setters (for direct manipulation when needed)
    setIsLoading,
    setVideoData,
    setLoadingText,
    setError,
    setLoadingStage,
    setVisibleInsights,
    setShowAISummary,
    setContainerHeight
  }
}

// Sample insights data (moved from main component)
const allInsights = [
  {
    time: "0:32",
    timeParam: "32s",
    color: "blue",
    content: "Google has partnered with Coinbase to create a virtual economy for AI agents, introducing the \"AI Money\" concept for autonomous transactions."
  },
  {
    time: "2:58",
    timeParam: "2m58s",
    color: "purple",
    content: "The partnership will enable AI systems to conduct financial transactions independently, potentially revolutionizing how artificial intelligence interacts with economic systems."
  },
  {
    time: "5:12",
    timeParam: "5m12s",
    color: "green",
    content: "Early implementations suggest AI agents could manage micro-payments, subscription services, and even investment decisions with minimal human oversight."
  },
  {
    time: "7:45",
    timeParam: "7m45s",
    color: "orange",
    content: "Security concerns arise around AI financial autonomy, with experts debating the need for regulatory frameworks and fail-safe mechanisms."
  },
  {
    time: "10:23",
    timeParam: "10m23s",
    color: "red",
    content: "The technology could extend beyond payments to encompass full economic participation, including AI agents as business entities with legal standing."
  },
  {
    time: "12:56",
    timeParam: "12m56s",
    color: "indigo",
    content: "Implications for traditional banking are significant, as AI money systems could operate independently of conventional financial institutions."
  }
]

export { allInsights }