'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LoadingDots } from '@/components/LoadingDots'
import { initPostHog, trackEvent, trackPageView } from '@/lib/posthog'

export default function Home() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=8s6nGMcyr7k")

  // Initialize PostHog and session tracking
  useEffect(() => {
    initPostHog()
    trackPageView(window.location.href)

    // Track session start
    const sessionStart = Date.now()
    trackEvent('session_started', {
      timestamp: sessionStart,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`
    })

    // Track session duration on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - sessionStart) / 1000) // seconds
      trackEvent('session_ended', {
        duration_seconds: sessionDuration,
        duration_minutes: Math.round(sessionDuration / 60)
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Rotate hero text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  const [isLoading, setIsLoading] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [loadingText, setLoadingText] = useState("...")
  const [isHoveringLoader, setIsHoveringLoader] = useState(false)
  const [visibleInsights, setVisibleInsights] = useState(3)
  const [showAISummary, setShowAISummary] = useState(false)
  const [activeCommentView, setActiveCommentView] = useState('summary')
  const [containerHeight, setContainerHeight] = useState('auto') // Start with auto height
  const [selectedComment, setSelectedComment] = useState(null)
  const [loadingStage, setLoadingStage] = useState('idle') // idle, fetching, hero, insights, comments, complete
  const [showExtendedContext, setShowExtendedContext] = useState(false)
  const [isWorkshopMode, setIsWorkshopMode] = useState(false)
  const [showWorkshopControls, setShowWorkshopControls] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoritedComments, setFavoritedComments] = useState(new Set())
  const [favoriteAuthors, setFavoriteAuthors] = useState(new Set())
  const [heroTextIndex, setHeroTextIndex] = useState(0)

  const heroTexts = [
    "Extract key insights in seconds",
    "Discover hidden gems instantly",
    "Transform content into knowledge",
    "Uncover meaningful discussions",
    "Filter signal from noise"
  ]
  const [showNewUrlInput, setShowNewUrlInput] = useState(false)
  const [newUrl, setNewUrl] = useState('')

  const loadingMessages = [
    "Validating URL...",
    "Fetching video data...",
    "Reading page content...",
    "Analyzing transcript...",
    "Processing comments...",
    "Creating summaries...",
    "Extracting insights...",
    "Finalizing results..."
  ]

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
      content: "This represents the first major implementation of Agent-to-Agent (A2A) payment protocols for micro-transactions."
    },
    {
      time: "7:42",
      timeParam: "7m42s",
      color: "green",
      content: "The system enables AI agents to automatically purchase services, data, and resources without human oversight."
    },
    {
      time: "12:15",
      timeParam: "12m15s",
      color: "orange",
      content: "Traditional financial institutions may need to adapt quickly to this new paradigm of autonomous AI commerce."
    },
    {
      time: "18:30",
      timeParam: "18m30s",
      color: "red",
      content: "Early adopters could gain significant advantages in the emerging AI-driven marketplace ecosystem."
    },
    {
      time: "21:45",
      timeParam: "21m45s",
      color: "indigo",
      content: "The integration raises important questions about regulation, oversight, and the future of human-controlled transactions."
    }
  ]

  const handleGetStarted = async () => {
    // Track analysis start
    trackEvent('analysis_started', {
      url: url,
      mode: isWorkshopMode ? 'workshop' : 'normal'
    })

    if (isWorkshopMode) {
      // Workshop mode - just load data, stay in idle, user controls progression
      setShowAISummary(false)
      setVisibleInsights(3)
      setFavoritedComments(new Set())
      setFavoriteAuthors(new Set())
      setShowNewUrlInput(false)
      setNewUrl('')
      try {
        const response = await fetch('/sample-video.json')
        const data = await response.json()
        setVideoData(data[0])
      } catch (error) {
        console.error('Error loading video data:', error)
      }
      return
    }

    // Normal automatic mode
    setIsLoading(true)
    setLoadingText("...")
    setVisibleInsights(3)
    setShowAISummary(false)
    setFavoritedComments(new Set())
    setFavoriteAuthors(new Set())
    setShowNewUrlInput(false)
    setNewUrl('')
    setLoadingStage('fetching')
    setContainerHeight('120px')

    const stageSequence = async () => {
      setLoadingText("Fetching video data...")
      setContainerHeight('200px')
      await new Promise(resolve => setTimeout(resolve, 1500))

      setLoadingStage('hero')
      setLoadingText("Loading video information...")
      setContainerHeight('400px')

      try {
        const response = await fetch('/sample-video.json')
        const data = await response.json()
        setVideoData(data[0])
      } catch (error) {
        console.error('Error loading video data:', error)
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      setLoadingStage('insights')
      setLoadingText("Extracting key insights...")
      await new Promise(resolve => setTimeout(resolve, 1000))

      setLoadingText("Analyzing comments...")
      await new Promise(resolve => setTimeout(resolve, 1500))

      setLoadingStage('comments')
      setLoadingText("Loading comment insights...")
      await new Promise(resolve => setTimeout(resolve, 1000))

      setLoadingStage('complete')
      setContainerHeight('auto')
      setIsLoading(false)
    }

    const skipOnHover = () => {
      if (isHoveringLoader) {
        setLoadingStage('complete')
        setContainerHeight('auto')
        setIsLoading(false)
      }
    }

    const hoverInterval = setInterval(skipOnHover, 100)

    try {
      await stageSequence()
    } catch (error) {
      console.error('Loading error:', error)
      setIsLoading(false)
      setLoadingStage('idle')
    } finally {
      clearInterval(hoverInterval)
    }
  }

  const loadMoreInsights = () => {
    if (visibleInsights >= allInsights.length) {
      // Generate AI Summary
      trackEvent('ai_summary_generated', {
        insights_count: allInsights.length,
        user_viewed_all: true
      })
      setShowAISummary(true)
      setVisibleInsights(0)
    } else {
      // User wants to see more insights
      const newCount = Math.min(visibleInsights + 3, allInsights.length)
      trackEvent('insights_expanded', {
        from: visibleInsights,
        to: newCount,
        total_available: allInsights.length,
        percentage_viewed: Math.round((newCount / allInsights.length) * 100)
      })
      setVisibleInsights(newCount)
    }
  }

  const toggleAISummary = () => {
    if (showAISummary) {
      trackEvent('ai_summary_hidden', {
        switched_to: 'individual_insights'
      })
      setShowAISummary(false)
      setVisibleInsights(3)
    } else {
      trackEvent('ai_summary_shown', {
        switched_from: 'individual_insights'
      })
      setShowAISummary(true)
      setVisibleInsights(0)
    }
  }

  // Workshop mode controls
  const stages = ['idle', 'fetching', 'hero', 'insights', 'comments', 'complete']
  const stageNames = {
    idle: 'Workshop',
    fetching: 'Fetching',
    hero: 'Hero',
    insights: 'Insights',
    comments: 'Comments',
    complete: 'Complete'
  }

  const nextStage = () => {
    const currentIndex = stages.indexOf(loadingStage)
    if (currentIndex < stages.length - 1) {
      const nextStageValue = stages[currentIndex + 1]
      setLoadingStage(nextStageValue)

      // Update loading text and state based on stage
      if (nextStageValue === 'fetching') {
        setLoadingText("Fetching url data...")
        setIsLoading(true)
      } else if (nextStageValue === 'hero') {
        setLoadingText("Loading video information...")
        setIsLoading(false)
      } else if (nextStageValue === 'insights') {
        setLoadingText("Extracting key insights...")
        setIsLoading(false)
      } else if (nextStageValue === 'comments') {
        setLoadingText("Loading comment insights...")
        setIsLoading(false)
      } else if (nextStageValue === 'complete') {
        setIsLoading(false)
      }
    }
  }

  const prevStage = () => {
    const currentIndex = stages.indexOf(loadingStage)
    if (currentIndex > 0) {
      const prevStageValue = stages[currentIndex - 1]
      setLoadingStage(prevStageValue)

      // Update loading text and state based on stage
      if (prevStageValue === 'idle') {
        setLoadingText("...")
        setIsLoading(false)
      } else if (prevStageValue === 'fetching') {
        setLoadingText("Fetching url data...")
        setIsLoading(true)
      } else if (prevStageValue === 'hero') {
        setLoadingText("Loading video information...")
        setIsLoading(false)
      } else if (prevStageValue === 'insights') {
        setLoadingText("Extracting key insights...")
        setIsLoading(false)
      }
    }
  }

  const resetAnimation = () => {
    setLoadingStage('idle')
    setLoadingText("...")
    setIsLoading(false)
    setVideoData(null)
    setVisibleInsights(3)
    setShowAISummary(false)
    setFavoritedComments(new Set())
    setFavoriteAuthors(new Set())
    setShowNewUrlInput(false)
    setNewUrl('')
  }

  const handleAnalyzeNewUrl = async () => {
    if (!newUrl.trim()) return

    // Reset all states
    setVideoData(null)
    setVisibleInsights(3)
    setShowAISummary(false)
    setFavoritedComments(new Set())
    setFavoriteAuthors(new Set())
    setShowNewUrlInput(false)
    setLoadingStage('fetching')
    setIsLoading(true)
    setLoadingText("Fetching video data...")
    setUrl(newUrl)
    setNewUrl('')

    // Load another video from JSON (cycling through the array)
    try {
      const response = await fetch('/sample-video.json')
      const data = await response.json()
      // For now, just pick a random video from the array
      const randomIndex = Math.floor(Math.random() * data.length)
      const selectedVideo = data[randomIndex]

      // Simulate loading stages
      await new Promise(resolve => setTimeout(resolve, 1500))
      setLoadingStage('hero')
      setVideoData(selectedVideo)

      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoadingStage('insights')

      await new Promise(resolve => setTimeout(resolve, 1500))
      setLoadingStage('comments')

      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoadingStage('complete')
      setIsLoading(false)

      // Track successful analysis completion
      trackEvent('analysis_completed', {
        url: url,
        mode: isWorkshopMode ? 'workshop' : 'normal'
      })
    } catch (error) {
      console.error('Error loading video data:', error)
      setIsLoading(false)
      setLoadingStage('idle')
    }
  }

  const findCommentTimestamp = (comment: any) => {
    // Extract potential timestamps from comment content
    const timeRegex = /(\d{1,2}):(\d{2})/g
    const matches = comment.content.match(timeRegex)
    if (matches && matches.length > 0) {
      return matches[0]
    }

    // Generate a mock timestamp based on comment position/content
    if (!videoData || !(videoData as any).comments?.comments) return '0:00'
    const commentIndex = (videoData as any).comments.comments.findIndex((c: any) => c.id === comment.id)
    const estimatedTime = Math.floor((commentIndex / (videoData as any).comments.comments.length) * (videoData as any).length)
    const minutes = Math.floor(estimatedTime / 60)
    const seconds = estimatedTime % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getCommentContext = (comment: any) => {
    const timestamp = findCommentTimestamp(comment)
    const [minutes, seconds] = timestamp.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds

    // Find transcript context around this time
    if (videoData && (videoData as any).transcript) {
      const contextEntry = (videoData as any).transcript.find((entry: any) =>
        entry.start <= totalSeconds * 1000 && entry.end >= totalSeconds * 1000
      )
      if (contextEntry) {
        return contextEntry.texts[0]
      }
    }

    // Generate contextual content based on comment content and timestamp
    const contextTemplates = [
      "The speaker was discussing AI autonomous transactions and how they might reshape commerce.",
      "At this point, the video covered the partnership between major tech companies and crypto platforms.",
      "The discussion focused on the implications of AI agents making financial decisions without human oversight.",
      "The speaker explained the technical aspects of agent-to-agent payment protocols.",
      "This section highlighted the potential risks and benefits of autonomous AI commerce systems.",
      "The video addressed regulatory challenges and questions about oversight in AI-driven transactions.",
      "The speaker was demonstrating real-world applications of AI money and virtual economies.",
      "At this moment, the discussion turned to how traditional financial institutions might adapt."
    ]

    const commentIndex = videoData ? (videoData as any).comments.comments.findIndex((c: any) => c.id === comment.id) : 0
    return contextTemplates[commentIndex % contextTemplates.length]
  }

  const getExtendedContext = (comment: any) => {
    const timestamp = findCommentTimestamp(comment)
    const [minutes, seconds] = timestamp.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds

    return {
      beforeContext: "...and that's where traditional payment systems start to fall short. When we look at autonomous AI agents...",
      mainContext: getCommentContext(comment),
      afterContext: "...which leads us to the question of whether regulatory frameworks can keep up with this pace of innovation.",
      topicSummary: "AI Autonomous Payments & Virtual Economies",
      keyPoints: [
        "Google-Coinbase partnership creates new payment paradigm",
        "AI agents can now transact without human intervention",
        "Virtual economies becoming increasingly sophisticated",
        "Regulatory challenges around autonomous financial decisions"
      ],
      relatedTimestamps: [
        { time: "2:15", topic: "Introduction to AI Money concept" },
        { time: "5:42", topic: "Technical implementation details" },
        { time: "8:30", topic: "Real-world use cases" },
        { time: "12:15", topic: "Regulatory implications" }
      ]
    }
  }

  const handleCommentClick = (comment: any, e: any) => {
    e.preventDefault()
    setSelectedComment(comment)
  }

  const toggleFavoriteComment = (commentId: string, e: any) => {
    e.stopPropagation()
    setFavoritedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const toggleFavoriteAuthor = (authorName: string, e: any) => {
    e.stopPropagation()
    setFavoriteAuthors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(authorName)) {
        newSet.delete(authorName)
      } else {
        newSet.add(authorName)
      }
      return newSet
    })
  }

  const generateMockReplies = (comment: any) => {
    if (comment.replyCount === 0) return []

    const mockReplies = [
      "Exactly! This is what I've been saying all along.",
      "I respectfully disagree. Here's why...",
      "Great point! This reminds me of...",
      "Can you elaborate on this part?",
      "This is revolutionary thinking.",
      "I'm not so sure about that argument.",
      "Thanks for sharing this perspective!",
      "This changes everything I thought I knew.",
      "Interesting take, but what about...",
      "You're absolutely right about this."
    ]

    const mockUsers = [
      "@TechExplorer42", "@AIEnthusiast", "@CryptoWatcher", "@FutureThinking",
      "@DigitalNomad", "@InnovationHub", "@TechReview", "@AIDiscussion",
      "@BlockchainBuzz", "@TechTrends"
    ]

    return Array.from({ length: Math.min(comment.replyCount, 3) }, (_, i) => ({
      id: `reply_${comment.id}_${i}`,
      content: mockReplies[i % mockReplies.length],
      authorDisplayName: mockUsers[i % mockUsers.length],
      likeCount: Math.floor(Math.random() * 20) + 1,
      publishedDate: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }))
  }

  const renderCommentContent = () => {
    // Get comments for each category
    if (!videoData) return null
    const topComments = (videoData as any).comments.comments.slice(0, 3)
    const insightComments = (videoData as any).comments.comments.filter((c: any) => c.content.toLowerCase().includes('ai') || c.content.toLowerCase().includes('future') || c.content.toLowerCase().includes('tech')).slice(0, 3)
    const lovedComments = (videoData as any).comments.comments.filter((c: any) => c.likeCount > 50 && (c.content.includes('!') || c.content.toLowerCase().includes('amazing') || c.content.toLowerCase().includes('great'))).slice(0, 3)
    const mixedComments = (videoData as any).comments.comments.filter((c: any) => c.content.toLowerCase().includes('but') || c.content.toLowerCase().includes('however') || c.content.toLowerCase().includes('concern')).slice(0, 3)
    const debateComments = (videoData as any).comments.comments.filter((c: any) => c.replyCount > 5 || c.content.includes('?')).slice(0, 3)

    if (activeCommentView === 'summary') {
      return (
        <div className="space-y-4">
          {/* Overall Summary */}
          <div className="relative p-2 md:p-4 bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-600/40 md:border-slate-600/30 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
            <div className="relative z-10">
              <div className="mb-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full border text-gray-300 bg-gray-500/20 border-gray-500/30">
                  {(videoData as any).comments.totalCount} comments analyzed
                </span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">
                Most viewers are excited about the AI-driven payment system, with many discussing its potential impact on traditional finance. Some express concerns about regulation and oversight, while others see early adoption opportunities.
              </p>
            </div>
          </div>

          {/* Top Comments Preview */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Most Popular
            </h4>
            <div className="space-y-4">
              {topComments.map((comment: any, index: number) => (
                <div
                  key={comment.id}
                  onClick={(e) => handleCommentClick(comment, e)}
                  className="block w-full text-left relative p-3 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                >
                  {/* Grainy texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                  {/* Subtle glow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                  {/* Light gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                  <div className="relative z-10 p-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-300 tracking-wide">
                          {comment.authorDisplayName.replace('@', '')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newFavorited = new Set(favoritedComments)
                          const isRemoving = newFavorited.has(comment.id)
                          if (isRemoving) {
                            newFavorited.delete(comment.id)
                          } else {
                            newFavorited.add(comment.id)
                          }
                          setFavoritedComments(newFavorited)

                          // Track favorite action
                          trackEvent('comment_favorited', {
                            action: isRemoving ? 'remove' : 'add',
                            comment_author: comment.authorDisplayName,
                            section: 'most_popular'
                          })
                        }}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                        title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg className={`w-3.5 h-3.5 transition-colors ${
                          favoritedComments.has(comment.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
                        }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-3 font-light">
                      {comment.content}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-600/20">
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                          <span className="text-yellow-400">👍</span>
                          <span className="font-medium">{comment.likeCount}</span>
                        </div>
                        {comment.replyCount > 0 && (
                          <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                            <span className="text-gray-500">💬</span>
                            <span className="font-medium">{comment.replyCount}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                          <span>📈</span>
                          <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        {/* Future: Add comment insights here */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Insights Preview */}
          {insightComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Tech Insights
              </h4>
              <div className="space-y-4">
                {insightComments.map((comment: any, index: number) => (
                  <div
                    key={comment.id}
                    onClick={(e) => handleCommentClick(comment, e)}
                    className="block w-full text-left relative p-3 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                  >
                    {/* Grainy texture overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                    {/* Subtle glow gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                    {/* Light gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                    <div className="relative z-10 p-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-gray-300 tracking-wide">
                            {comment.authorDisplayName.replace('@', '')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const newFavorited = new Set(favoritedComments)
                            if (newFavorited.has(comment.id)) {
                              newFavorited.delete(comment.id)
                            } else {
                              newFavorited.add(comment.id)
                            }
                            setFavoritedComments(newFavorited)
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                          title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className={`w-3.5 h-3.5 transition-colors ${
                            favoritedComments.has(comment.id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 group-hover/star:text-yellow-400'
                          }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-3 font-light">
                        {comment.content}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-600/20">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                            <span className="text-yellow-400">👍</span>
                            <span className="font-medium">{comment.likeCount}</span>
                          </div>
                          {comment.replyCount > 0 && (
                            <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                              <span className="text-gray-500">💬</span>
                              <span className="font-medium">{comment.replyCount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                            <span>📈</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          {/* Future: Add comment insights here */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loved Comments Preview */}
          {lovedComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Community Favorites
              </h4>
              <div className="space-y-4">
                {lovedComments.map((comment: any, index: number) => (
                  <div
                    key={comment.id}
                    onClick={(e) => handleCommentClick(comment, e)}
                    className="block w-full text-left relative p-3 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                  >
                    {/* Grainy texture overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                    {/* Subtle glow gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                    {/* Light gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                    <div className="relative z-10 p-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-gray-300 tracking-wide">
                            {comment.authorDisplayName.replace('@', '')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const newFavorited = new Set(favoritedComments)
                            if (newFavorited.has(comment.id)) {
                              newFavorited.delete(comment.id)
                            } else {
                              newFavorited.add(comment.id)
                            }
                            setFavoritedComments(newFavorited)
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                          title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className={`w-3.5 h-3.5 transition-colors ${
                            favoritedComments.has(comment.id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 group-hover/star:text-yellow-400'
                          }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-3 font-light">
                        {comment.content}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-600/20">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                            <span className="text-yellow-400">👍</span>
                            <span className="font-medium">{comment.likeCount}</span>
                          </div>
                          {comment.replyCount > 0 && (
                            <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                              <span className="text-gray-500">💬</span>
                              <span className="font-medium">{comment.replyCount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                            <span>📈</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          {/* Future: Add comment insights here */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mixed Reactions Preview */}
          {mixedComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Mixed Reactions
              </h4>
              <div className="space-y-4">
                {mixedComments.map((comment: any, index: number) => (
                  <div
                    key={comment.id}
                    onClick={(e) => handleCommentClick(comment, e)}
                    className="block w-full text-left relative p-3 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                  >
                    {/* Grainy texture overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                    {/* Subtle glow gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                    {/* Light gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                    <div className="relative z-10 p-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-gray-300 tracking-wide">
                            {comment.authorDisplayName.replace('@', '')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const newFavorited = new Set(favoritedComments)
                            if (newFavorited.has(comment.id)) {
                              newFavorited.delete(comment.id)
                            } else {
                              newFavorited.add(comment.id)
                            }
                            setFavoritedComments(newFavorited)
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                          title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className={`w-3.5 h-3.5 transition-colors ${
                            favoritedComments.has(comment.id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 group-hover/star:text-yellow-400'
                          }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-3 font-light">
                        {comment.content}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-600/20">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                            <span className="text-yellow-400">👍</span>
                            <span className="font-medium">{comment.likeCount}</span>
                          </div>
                          {comment.replyCount > 0 && (
                            <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                              <span className="text-gray-500">💬</span>
                              <span className="font-medium">{comment.replyCount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                            <span>📈</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          {/* Future: Add comment insights here */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debates Preview */}
          {debateComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Hot Debates
              </h4>
              <div className="space-y-4">
                {debateComments.map((comment: any, index: number) => (
                  <div
                    key={comment.id}
                    onClick={(e) => handleCommentClick(comment, e)}
                    className="block w-full text-left relative p-3 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                  >
                    {/* Grainy texture overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                    {/* Subtle glow gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                    {/* Light gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                    <div className="relative z-10 p-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-semibold text-gray-300 tracking-wide">
                            {comment.authorDisplayName.replace('@', '')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const newFavorited = new Set(favoritedComments)
                            if (newFavorited.has(comment.id)) {
                              newFavorited.delete(comment.id)
                            } else {
                              newFavorited.add(comment.id)
                            }
                            setFavoritedComments(newFavorited)
                          }}
                          className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                          title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg className={`w-3.5 h-3.5 transition-colors ${
                            favoritedComments.has(comment.id)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 group-hover/star:text-yellow-400'
                          }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 mb-3 font-light">
                        {comment.content}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-600/20">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                            <span className="text-yellow-400">👍</span>
                            <span className="font-medium">{comment.likeCount}</span>
                          </div>
                          {comment.replyCount > 0 && (
                            <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                              <span className="text-gray-500">💬</span>
                              <span className="font-medium">{comment.replyCount}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                            <span>📈</span>
                            <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 italic">
                          {/* Future: Add comment insights here */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    const filteredComments = () => {
      if (!videoData) return []
      switch (activeCommentView) {
        case 'top':
          return (videoData as any).comments.comments.slice(0, 10)
        case 'insights':
          return (videoData as any).comments.comments.filter((c: any) => {
            const content = c.content.toLowerCase()
            const insightKeywords = ['ai', 'future', 'tech', 'innovation', 'breakthrough', 'solution', 'analysis', 'perspective', 'insight', 'understanding', 'deep', 'profound', 'realize', 'discover', 'reveals', 'explains', 'theory', 'concept', 'principle', 'methodology', 'approach', 'strategy', 'implications', 'consequences', 'significance', 'impact', 'evolution', 'transformation', 'paradigm', 'framework', 'model', 'system']
            const hasInsightKeywords = insightKeywords.some(keyword => content.includes(keyword))
            const hasQuestions = c.content.includes('?') && c.content.length > 50
            const hasDeepThought = c.content.length > 100 && (content.includes('think') || content.includes('believe') || content.includes('opinion'))
            const hasHighEngagement = c.likeCount > 20 || c.replyCount > 3
            return (hasInsightKeywords || hasQuestions || hasDeepThought) && hasHighEngagement
          }).slice(0, 8)
        case 'loved':
          return (videoData as any).comments.comments.filter((c: any) => c.likeCount > 50 && (c.content.includes('!') || c.content.toLowerCase().includes('amazing') || c.content.toLowerCase().includes('great'))).slice(0, 8)
        case 'mixed':
          return (videoData as any).comments.comments.filter((c: any) =>
            favoriteAuthors.has(c.authorDisplayName)
          ).slice(0, 8)
        case 'debates':
          return (videoData as any).comments.comments.filter((c: any) => c.content.toLowerCase().includes('but') || c.content.toLowerCase().includes('however') || c.content.toLowerCase().includes('concern') || c.replyCount > 5 || c.content.includes('?')).slice(0, 8)
        case 'favorites':
          return (videoData as any).comments.comments.filter((c: any) =>
            favoritedComments.has(c.id) || favoriteAuthors.has(c.authorDisplayName)
          ).slice(0, 8)
        default:
          return (videoData as any).comments.comments.slice(0, 10)
      }
    }

    return (
      <div className="space-y-3">
        {filteredComments().map((comment: any, index: number) => (
          <div
            key={comment.id}
            onClick={(e) => handleCommentClick(comment, e)}
            className="block w-full text-left relative p-2 md:p-4 bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 md:from-slate-900/95 md:via-slate-800/85 md:to-slate-900/95 backdrop-blur-lg rounded-xl md:rounded-2xl border border-slate-600/50 md:border-slate-600/40 shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-slate-900/40 hover:border-slate-400/60 hover:scale-[1.02] transition-all duration-500 group cursor-pointer"
          >
            {/* Premium grainy texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:28px_28px] opacity-15"></div>
            {/* Dynamic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-transparent via-transparent to-violet-500/6 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent opacity-50"></div>
            {/* Enhanced top highlight */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent"></div>
            <div className="relative z-10 p-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-200 tracking-wide">
                    {comment.authorDisplayName.replace('@', '')}
                  </span>
                  <button
                    onClick={(e) => toggleFavoriteAuthor(comment.authorDisplayName, e)}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors group/author"
                    title={favoriteAuthors.has(comment.authorDisplayName) ? "Remove author from favorites" : "Add author to favorites"}
                  >
                    <svg className={`w-3 h-3 transition-colors ${
                      favoriteAuthors.has(comment.authorDisplayName)
                        ? 'text-purple-400 fill-purple-400'
                        : 'text-gray-500 group-hover/author:text-purple-400'
                    }`} fill={favoriteAuthors.has(comment.authorDisplayName) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={(e) => toggleFavoriteComment(comment.id, e)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors group/star"
                  title={favoritedComments.has(comment.id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <svg className={`w-4 h-4 transition-colors ${
                    favoritedComments.has(comment.id)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400 group-hover/star:text-yellow-400'
                  }`} fill={favoritedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-100 leading-relaxed line-clamp-3 mb-4 font-light">
                {comment.content}
              </p>
              <div className="flex items-center space-x-4 pt-3 border-t border-gray-600/30 text-sm text-gray-400">
                <div className="flex items-center space-x-1" title={`${comment.likeCount} likes`}>
                  <span className="text-yellow-400">👍</span>
                  <span className="font-medium">{comment.likeCount}</span>
                </div>
                {comment.replyCount > 0 && (
                  <div className="flex items-center space-x-1" title={`${comment.replyCount} replies`}>
                    <span className="text-gray-500">💬</span>
                    <span className="font-medium">{comment.replyCount}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                  <span>📈</span>
                  <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 flex flex-col relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/8 dark:bg-pink-600/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
      </div>
      {/* Enhanced grain overlay */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.4)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-transparent via-black to-transparent mix-blend-overlay"></div>
      </div>
      {/* Animated Grid Overlay with Wave Effect */}
      <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06] pointer-events-none">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(59,130,246,0.4)_1px,transparent_0)] bg-[length:40px_40px]"
          style={{
            animation: 'gridWave1 8s ease-in-out infinite',
            transform: 'translateX(0) translateY(0)'
          }}
        ></div>
      </div>
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(168,85,247,0.5)_0.5px,transparent_0)] bg-[length:60px_60px]"
          style={{
            animation: 'gridWave2 12s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
      </div>
      <div className="absolute inset-0 opacity-[0.10] dark:opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_1.5px_1.5px,rgba(34,197,94,0.4)_1px,transparent_0)] bg-[length:80px_80px]"
          style={{
            animation: 'gridWave3 16s ease-in-out infinite',
            animationDelay: '4s'
          }}
        ></div>
      </div>
      <style jsx>{`
        @keyframes gridWave1 {
          0%, 100% {
            opacity: 0.12;
            transform: translateX(0px) translateY(0px) scale(1);
          }
          25% {
            opacity: 0.18;
            transform: translateX(2px) translateY(1px) scale(1.02);
          }
          50% {
            opacity: 0.08;
            transform: translateX(-1px) translateY(2px) scale(0.98);
          }
          75% {
            opacity: 0.15;
            transform: translateX(1px) translateY(-1px) scale(1.01);
          }
        }

        @keyframes gridWave2 {
          0%, 100% {
            opacity: 0.08;
            transform: translateX(0px) translateY(0px) scale(1) rotate(0deg);
          }
          33% {
            opacity: 0.12;
            transform: translateX(-2px) translateY(1px) scale(1.01) rotate(0.5deg);
          }
          66% {
            opacity: 0.04;
            transform: translateX(1px) translateY(-2px) scale(0.99) rotate(-0.3deg);
          }
        }

        @keyframes gridWave3 {
          0%, 100% {
            opacity: 0.10;
            transform: translateX(0px) translateY(0px) scale(1);
          }
          20% {
            opacity: 0.14;
            transform: translateX(1px) translateY(2px) scale(1.03);
          }
          40% {
            opacity: 0.06;
            transform: translateX(-2px) translateY(0px) scale(0.97);
          }
          60% {
            opacity: 0.12;
            transform: translateX(0px) translateY(-1px) scale(1.01);
          }
          80% {
            opacity: 0.08;
            transform: translateX(1px) translateY(1px) scale(0.99);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 0.35;
          }
          40% {
            transform: translateY(-3px);
            opacity: 0.45;
          }
          60% {
            transform: translateY(-3px);
            opacity: 0.45;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.35;
          }
        }

        @keyframes floatDots {
          0% {
            transform: translateY(0px);
          }
          40% {
            transform: translateY(-2px);
          }
          60% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes slideInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }


        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
      {/* Top Bar */}
      <header className="w-full p-1 md:p-4 relative">
        <div className="max-w-md mx-auto flex items-center justify-end">
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live</span>
          </div>
        </div>
      </header>

      {/* Middle View - Centered Form */}
      <main className="flex-1 flex items-center justify-center p-1 md:p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              <span style={{ letterSpacing: '1px' }}>Brief</span><span className="relative top-px inline-block" style={{ marginLeft: '2px' }}>
                <span className="inline-block" style={{ animation: 'float 2s ease-in-out infinite', animationDelay: '0s' }}>i</span>
                <span className="inline-block" style={{ animation: 'float 2s ease-in-out infinite', animationDelay: '0.3s' }}>f</span>
                <span className="inline-block" style={{ animation: 'float 2s ease-in-out infinite', animationDelay: '0.6s' }}>y</span>
              </span>
            </h1>
            <div className="mb-6">
              <p className="text-xl font-light italic tracking-wide font-serif bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 dark:from-slate-400 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                <em>brief</em>&nbsp;insights for you
              </p>
            </div>
          </div>

          <div
            className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-700 ease-in-out"
            style={{
              minHeight: isLoading ? '200px' : 'auto',
              transition: 'min-height 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out'
            }}
          >
            {(!videoData && !isWorkshopMode) || (isWorkshopMode && (loadingStage === 'idle' || loadingStage === 'fetching')) ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    YouTube URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=8s6nGMcyr7k"
                      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-mono transition-all duration-500 ${isLoading ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                {!isLoading ? (
                  <div className="space-y-3">

                    <button
                      onClick={handleGetStarted}
                      className="w-full bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-medium py-4 px-4 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-slate-900/60 relative overflow-hidden group"
                    >
                      {/* Inner grain texture */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:15px_15px] opacity-40"></div>
                      {/* Glass highlight */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                      {/* Bottom highlight */}
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
                      <span className="relative z-10 font-semibold tracking-wide">Get Started</span>
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 transition-all duration-500">
                      {heroTexts[heroTextIndex]}
                    </p>

                  </div>
                ) : (
                  <div className="py-4">
                    <div
                      className="text-gray-500 dark:text-gray-400 text-sm font-mono transition-all duration-300"
                      style={{ marginLeft: '2px' }}
                      onMouseEnter={() => setIsHoveringLoader(true)}
                      onMouseLeave={() => setIsHoveringLoader(false)}
                    >
                      {(loadingText === "..." || (isWorkshopMode && loadingStage === 'idle')) ? (
                        <div className="flex items-center space-x-0">
                          <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0s' }}>.</span>
                          <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.3s' }}>.</span>
                          <span className="inline-block" style={{ animation: 'floatDots 2s ease-in-out infinite', animationDelay: '0.6s' }}>.</span>
                        </div>
                      ) : (
                        loadingText
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-6">
                {/* Video Hero Header - Shows when loadingStage >= 'hero' AND we have video data */}
                {videoData && (loadingStage === 'hero' || loadingStage === 'insights' || loadingStage === 'comments' || loadingStage === 'complete') && (
                  <div
                    className="relative rounded-2xl overflow-hidden mb-6 bg-gray-900 transition-all duration-1000 ease-out"
                    style={{
                      animation: loadingStage === 'hero'
                        ? 'fadeInScale 1s ease-out forwards'
                        : 'none'
                    }}
                  >
                    {/* Gradient Background */}
                    <div
                      className="absolute transition-all duration-1500 ease-out"
                      style={{
                        top: '-20px',
                        right: '-20px',
                        bottom: '-20px',
                        left: '-20px',
                        background: loadingStage === 'hero'
                          ? 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 50%, #334155 75%, #1e293b 100%)'
                          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
                        transform: loadingStage === 'hero' ? 'scale(1.2)' : 'scale(1.1)',
                        transition: 'transform 1.5s ease-out, background 1.5s ease-out'
                      }}
                    ></div>
                    {/* Noise Effect Overlay */}
                    <div className="absolute inset-0 opacity-15">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                          mixBlendMode: 'overlay'
                        }}
                      ></div>
                    </div>

                    {/* Accent Gradient Overlay */}
                    <div className={`absolute inset-0 transition-all duration-1500 ease-out ${
                      loadingStage === 'hero'
                        ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/15 to-slate-900/20'
                        : 'bg-gradient-to-br from-blue-800/10 via-purple-800/8 to-slate-800/10'
                    }`}></div>

                    {/* Bottom gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Loading shimmer effect */}
                    {loadingStage === 'hero' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse"
                           style={{
                             animation: 'shimmer 2s ease-in-out infinite',
                             backgroundSize: '200% 100%'
                           }}>
                      </div>
                    )}
                    {/* Dot Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.15]">
                      <div className="w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:24px_24px]"></div>
                    </div>
                    {/* Additional subtle dot pattern */}
                    <div className="absolute inset-0 opacity-[0.08]">
                      <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_0.5px,transparent_0)] bg-[length:12px_12px]"></div>
                    </div>
                    {/* Content */}
                    <div className="relative z-10 p-6 min-h-[160px] flex flex-col justify-end">
                      <h2
                        className="text-lg font-bold text-white mb-3 leading-tight drop-shadow-lg"
                        style={{
                          animation: loadingStage === 'hero'
                            ? 'slideInUp 1s ease-out 0.3s forwards'
                            : 'none',
                          opacity: loadingStage === 'hero' ? '0' : '1'
                        }}
                      >
                        {(videoData as any)?.title}
                      </h2>
                      <div
                        className="space-y-1"
                        style={{
                          animation: loadingStage === 'hero'
                            ? 'slideInUp 1s ease-out 0.6s forwards'
                            : 'none',
                          opacity: loadingStage === 'hero' ? '0' : '1'
                        }}
                      >
                        <p className="text-sm text-gray-200">
                          By {(videoData as any)?.author}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-300">
                            <span>{(videoData as any)?.viewCount?.toLocaleString()} views</span>
                            <span>•</span>
                            <span>{Math.floor((videoData as any)?.length / 60)}:{((videoData as any)?.length % 60)?.toString().padStart(2, '0')} min</span>
                          </div>
                          <button
                            onClick={() => setIsFavorited(!isFavorited)}
                            className="p-1.5 rounded-full hover:bg-white/10 transition-colors group"
                            title={isFavorited ? "Remove from favorites" : "Favorite this video"}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isFavorited
                                ? 'bg-yellow-400/20 border border-yellow-400/40'
                                : 'bg-gray-600/20 border border-gray-500/30 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30'
                            }`}>
                              <svg className={`w-3 h-3 transition-colors ${
                                isFavorited
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 group-hover:text-yellow-400'
                              }`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading state for next section when in hero stage */}
                {loadingStage === 'hero' && (
                  <div className="py-4">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-mono transition-all duration-300">
                      Extracting key insights...
                    </div>
                  </div>
                )}

                {/* Key Insights - Shows when loadingStage >= 'insights' AND we have video data */}
                {videoData && (loadingStage === 'insights' || loadingStage === 'comments' || loadingStage === 'complete') && (
                  <div
                    className="transition-all duration-1000 ease-out transform"
                    style={{
                      animation: loadingStage === 'insights'
                        ? 'slideInUp 1s ease-out forwards'
                        : 'none',
                      opacity: loadingStage === 'insights' ? '0' : '1'
                    }}
                  >
                    <h3
                      className="text-md font-semibold text-gray-900 dark:text-white mb-4"
                      style={{
                        animation: loadingStage === 'insights'
                          ? 'slideInUp 1s ease-out 0.2s forwards'
                          : 'none',
                        opacity: loadingStage === 'insights' ? '0' : '1'
                      }}
                    >
                      Key Insights
                    </h3>
                    <div className="space-y-3">
                      {allInsights.slice(0, visibleInsights).map((insight, index) => (
                        <div
                          key={index}
                          className="relative p-2 md:p-4 bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-600/40 md:border-slate-600/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                          style={{
                            animation: loadingStage === 'insights'
                              ? `slideInUp 1s ease-out ${0.3 + (index * 0.1)}s forwards`
                              : 'none',
                            opacity: loadingStage === 'insights' ? '0' : '1'
                          }}
                        >
                          {/* Inner grain texture */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
                          {/* Gradient highlight */}
                          <div className={`absolute inset-0 bg-gradient-to-br opacity-60 ${
                            insight.color === 'blue' ? 'from-blue-500/10 via-transparent to-purple-500/10' :
                            insight.color === 'purple' ? 'from-purple-500/10 via-transparent to-pink-500/10' :
                            insight.color === 'green' ? 'from-green-500/10 via-transparent to-teal-500/10' :
                            insight.color === 'orange' ? 'from-orange-500/10 via-transparent to-yellow-500/10' :
                            insight.color === 'red' ? 'from-red-500/10 via-transparent to-pink-500/10' :
                            'from-indigo-500/10 via-transparent to-blue-500/10'
                          }`}></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <a
                                  href={`${url}&t=${insight.timeParam}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center space-x-2 text-xs font-mono px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                                    insight.color === 'blue' ? 'text-blue-300 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30' :
                                    insight.color === 'purple' ? 'text-purple-300 bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30' :
                                    insight.color === 'green' ? 'text-green-300 bg-green-500/20 border-green-500/30 hover:bg-green-500/30' :
                                    insight.color === 'orange' ? 'text-orange-300 bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30' :
                                    insight.color === 'red' ? 'text-red-300 bg-red-500/20 border-red-500/30 hover:bg-red-500/30' :
                                    'text-indigo-300 bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30'
                                  }`}
                                >
                                  <span>{insight.time}</span>
                                  <svg className="w-2.5 h-2.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                            <p className="text-sm text-gray-200 leading-relaxed">
                              {insight.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More/Collapse Button or Loading State */}
                    <div className="mt-3">
                      {loadingStage === 'complete' ? (
                        <button
                          onClick={showAISummary ? toggleAISummary : loadMoreInsights}
                          className="w-full relative p-2 md:p-4 bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-600/40 md:border-slate-600/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                          {/* Inner grain texture */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-200 font-medium">
                                  {showAISummary ? 'Show insights' : (visibleInsights >= allInsights.length ? 'Generate AI Summary' : 'Show more')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                                  {showAISummary ? '→' : (visibleInsights >= allInsights.length ? '🤖' : '+')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      ) : loadingStage === 'insights' ? (
                        <div className="w-full relative p-2 md:p-4 bg-gradient-to-r from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm rounded-xl md:rounded-2xl border border-slate-600/40 md:border-slate-600/30 shadow-lg overflow-hidden">
                          {/* Inner grain texture */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
                          <div className="relative z-10">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                              <span className="text-sm text-gray-400 font-mono">
                                Analyzing comments...
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Comments Analysis - Shows when loadingStage >= 'comments' AND we have video data */}
                {videoData && (loadingStage === 'comments' || loadingStage === 'complete') && (
                  <div className="space-y-3 md:space-y-6">
                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Comments
                    </h3>

                    {/* Analysis Icons */}
                    <div className="relative flex items-center justify-between mb-6 p-2 md:p-4 bg-gray-900/95 md:bg-gray-900 rounded-lg md:rounded-xl border border-slate-600/40 md:border-slate-600/30 overflow-hidden">
                      {/* Hero-style gradient background */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
                        }}
                      ></div>
                      {/* Noise Effect Overlay */}
                      <div className="absolute inset-0 opacity-15">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            mixBlendMode: 'overlay'
                          }}
                        ></div>
                      </div>
                      {/* Accent Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 via-purple-800/8 to-slate-800/10"></div>
                      {/* Dot Grid Pattern Overlay */}
                      <div className="absolute inset-0 opacity-[0.15]">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:24px_24px]"></div>
                      </div>
                      {/* Content wrapper */}
                      <div className="relative z-10 w-full flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => setActiveCommentView('summary')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'summary' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">📊</div>
                          <span className="text-xs text-gray-300">Summary</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('top')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'top' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">🔥</div>
                          <span className="text-xs text-gray-300">Top</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('insights')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'insights' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">💭</div>
                          <span className="text-xs text-gray-300">Insights</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('loved')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'loved' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">⭐</div>
                          <span className="text-xs text-gray-300">Starred</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('mixed')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'mixed' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">👥</div>
                          <span className="text-xs text-gray-300">Following</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('debates')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'debates' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">⚡</div>
                          <span className="text-xs text-gray-300">Mixed</span>
                        </button>
                        <button
                          onClick={() => setActiveCommentView('favorites')}
                          className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeCommentView === 'favorites' ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-80'}`}
                        >
                          <div className="text-lg">⭐</div>
                          <span className="text-xs text-gray-300">Favorites</span>
                        </button>
                      </div>
                      </div>
                    </div>

                    {/* Dynamic Comment Content */}
                    <div>{renderCommentContent()}</div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Action Button - Outside the glass pane */}
          {loadingStage === 'complete' && videoData && !isWorkshopMode && (
            <div className="mt-6">
              {!showNewUrlInput ? (
                <button
                  onClick={() => setShowNewUrlInput(true)}
                  className="w-full bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-medium py-3 px-4 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-slate-900/60 relative overflow-hidden group"
                  style={{
                    animation: 'slideInUp 1s ease-out 0.5s forwards',
                    opacity: '0'
                  }}
                >
                  {/* Inner grain texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:15px_15px] opacity-40"></div>
                  {/* Glass highlight */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  {/* Bottom highlight */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
                  <span className="relative z-10 font-semibold tracking-wide">Analyze New URL</span>
                </button>
              ) : (
                <div className="space-y-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New YouTube URL
                    </label>
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-mono"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAnalyzeNewUrl()
                        }
                      }}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAnalyzeNewUrl}
                      disabled={!newUrl.trim()}
                      className="flex-1 bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-medium py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-slate-900/60 relative overflow-hidden group"
                    >
                      <span className="relative z-10 font-semibold tracking-wide">Analyze</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowNewUrlInput(false)
                        setNewUrl('')
                      }}
                      className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="p-1 md:p-4 flex justify-center">
        <div className="max-w-md w-full text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Optimized for mobile • AI-powered content analysis
          </p>
        </div>
      </footer>

      {/* Fixed theme toggle and workshop mode in bottom right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        {/* Workshop Mode Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setIsWorkshopMode(!isWorkshopMode)
              if (!isWorkshopMode) {
                setShowWorkshopControls(false)
              }
            }}
            className={`group relative p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md ${
              isWorkshopMode
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label="Toggle workshop mode"
            title="Activate Workshop"
          >
            <div className="relative w-5 h-5">
              {/* Workshop icon */}
              <svg
                className={`w-5 h-5 transition-all duration-300 ${
                  isWorkshopMode ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
          </button>

          {/* Workshop Controls Popup - Shows when workshop mode is active */}
          {isWorkshopMode && (
            <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="space-y-1.5">
                {/* Stage Indicator */}
                <div className="text-center px-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{(stageNames as any)[loadingStage]}</span>
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <button
                    onClick={prevStage}
                    disabled={loadingStage === 'idle'}
                    className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200"
                    title="Previous Stage"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={resetAnimation}
                    className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600/80 text-white transition-all duration-200"
                    title="Reset"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>

                  <button
                    onClick={nextStage}
                    disabled={loadingStage === 'complete'}
                    className="p-1.5 rounded bg-slate-700/80 hover:bg-slate-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200"
                    title="Next Stage"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        <ThemeToggle />
      </div>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-1 md:p-4">
          <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comment Details</h3>
              <button
                onClick={() => {setSelectedComment(null); setShowExtendedContext(false)}}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-gray-500 dark:text-gray-400">✕</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-2 md:p-4 space-y-4">
              {/* Author Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {selectedComment.authorDisplayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedComment.authorDisplayName.replace('@', '')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(selectedComment.publishedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Comment Text */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedComment.content}
                </p>
              </div>

              {/* Video Context */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Video Context</h4>
                  <button
                    onClick={() => setShowExtendedContext(!showExtendedContext)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <span>{showExtendedContext ? 'Show Less' : 'Show More Context'}</span>
                    <span>{showExtendedContext ? '↑' : '↓'}</span>
                  </button>
                </div>

                {/* Timestamp */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Timestamp:</span>
                    <a
                      href={`${url}&t=${findCommentTimestamp(selectedComment).replace(':', 'm')}s`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      {findCommentTimestamp(selectedComment)} ↗
                    </a>
                  </div>
                </div>

                {!showExtendedContext ? (
                  /* Basic Context */
                  <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/55 to-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30">
                    <div className="text-xs text-gray-400 mb-2">What was happening at this time:</div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      "{getCommentContext(selectedComment)}"
                    </p>
                  </div>
                ) : (
                  /* Extended Context */
                  <div className="space-y-3">
                    {/* Topic Summary */}
                    <div className="bg-gradient-to-r from-blue-900/20 via-blue-800/15 to-blue-900/20 backdrop-blur-sm rounded-xl p-3 border border-blue-600/20">
                      <div className="text-xs text-blue-400 mb-2">Topic at this timestamp:</div>
                      <p className="text-sm text-blue-200 font-medium">
                        {getExtendedContext(selectedComment).topicSummary}
                      </p>
                    </div>

                    {/* Extended Context */}
                    <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/55 to-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-600/30">
                      <div className="text-xs text-gray-400 mb-2">Full context:</div>
                      <div className="text-sm text-gray-200 leading-relaxed space-y-2">
                        <p className="text-gray-300 italic">
                          {getExtendedContext(selectedComment).beforeContext}
                        </p>
                        <p className="text-white font-medium">
                          "{getExtendedContext(selectedComment).mainContext}"
                        </p>
                        <p className="text-gray-300 italic">
                          {getExtendedContext(selectedComment).afterContext}
                        </p>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div className="bg-gradient-to-r from-purple-900/20 via-purple-800/15 to-purple-900/20 backdrop-blur-sm rounded-xl p-3 border border-purple-600/20">
                      <div className="text-xs text-purple-400 mb-2">Key points covered:</div>
                      <ul className="space-y-1">
                        {getExtendedContext(selectedComment).keyPoints.map((point, index) => (
                          <li key={index} className="text-xs text-purple-200 flex items-start space-x-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Related Timestamps */}
                    <div className="bg-gradient-to-r from-green-900/20 via-green-800/15 to-green-900/20 backdrop-blur-sm rounded-xl p-3 border border-green-600/20">
                      <div className="text-xs text-green-400 mb-2">Related timestamps:</div>
                      <div className="space-y-1">
                        {getExtendedContext(selectedComment).relatedTimestamps.map((item, index) => (
                          <a
                            key={index}
                            href={`${url}&t=${item.time.replace(':', 'm')}s`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-xs text-green-200 hover:text-green-100 transition-colors group"
                          >
                            <span className="font-mono bg-green-800/30 px-2 py-1 rounded">
                              {item.time}
                            </span>
                            <span className="flex-1">{item.topic}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}</div>


              {/* Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span>👍</span>
                    <span>{selectedComment.likeCount}</span>
                  </span>
                  {selectedComment.replyCount > 0 && (
                    <span>{selectedComment.replyCount} replies</span>
                  )}
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${(videoData as any)?.id}&lc=${selectedComment.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View on YouTube ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}