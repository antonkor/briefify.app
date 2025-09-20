'use client'

import { useState, useEffect } from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import { VideoInputForm } from '../components/VideoInputForm'
import { VideoCard } from '../components/VideoCard'
import { CommentViewer } from '../components/CommentViewer'
import { useAnalytics } from '../hooks/useAnalytics'
import { useScrollEffects } from '../hooks/useScrollEffects'
import { useHeroText } from '../hooks/useHeroText'
import { useVideoAnalysis, allInsights } from '../hooks/useVideoAnalysis'
import { useCommentInteractions } from '../hooks/useCommentInteractions'
import { useFavorites } from '../hooks/useFavorites'
import {
  WrenchScrewdriverIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [url, setUrl] = useState('')
  const [videoData, setVideoData] = useState(null)
  const [hoveringLoader, setHoveringLoader] = useState(false)
  const [isWorkshopMode, setIsWorkshopMode] = useState(false)
  const [showWorkshopControls, setShowWorkshopControls] = useState(false)
  const [isVibeMode, setIsVibeMode] = useState(false)
  const [showStars, setShowStars] = useState(false)

  // Initialize all hooks
  const { trackEvent } = useAnalytics()
  useScrollEffects()

  // Scroll effect to show stars at bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const threshold = documentHeight - 200 // Show stars 200px before bottom

      setShowStars(scrollPosition >= threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const { currentHeroText } = useHeroText()
  const {
    isLoading,
    videoData: hookVideoData,
    loadingText,
    loadingStage,
    visibleInsights,
    showAISummary,
    loadVideoInNormalMode,
    loadVideoInWorkshopMode,
    nextStage,
    prevStage,
    resetAnimation,
    goToBeginning,
    goToEnd,
    loadMoreInsights,
    toggleAISummary,
    setVideoData: hookSetVideoData
  } = useVideoAnalysis()
  const { activeCommentView, getCommentSummary, getCommentsByView, handleCommentClick } = useCommentInteractions()
  const {
    favoritedComments,
    favoriteAuthors,
    toggleFavoriteComment,
    toggleFavoriteAuthor,
    isCommentFavorited,
    isAuthorFavorited
  } = useFavorites()

  // Sync hook video data with local state
  useEffect(() => {
    if (hookVideoData && !videoData) {
      setVideoData(hookVideoData)
    }
  }, [hookVideoData, videoData])

  const handleGetStarted = async () => {
    console.log('Get Started clicked!')

    // Use entered URL or default to placeholder URL for demo
    const videoUrl = url || "https://www.youtube.com/watch?v=8s6nGMcyr7k"
    console.log('Using URL:', videoUrl)
    console.log('Workshop mode:', isWorkshopMode)

    try {
      if (isWorkshopMode) {
        console.log('Loading in workshop mode...')
        await loadVideoInWorkshopMode(videoUrl)
      } else {
        console.log('Loading in normal mode...')
        await loadVideoInNormalMode(videoUrl, trackEvent)
      }
      console.log('Loading function completed')
    } catch (error) {
      console.error('Error in handleGetStarted:', error)
    }
  }

  // Helper function for generating mock replies
  const generateMockReplies = (comment: any) => {
    if (!comment.replyCount || comment.replyCount === 0) return []

    const mockReplies = [
      "This is such a great point! I hadn't thought about it that way.",
      "Thanks for sharing this insight, really helpful!",
      "I disagree with this take, but respect your perspective.",
      "Can you elaborate more on this? Would love to understand better.",
      "This completely changed my mind on the topic.",
      "Great analysis! Do you have any sources for this?",
      "I've been thinking the same thing for a while now.",
      "This is exactly what I needed to hear today."
    ]

    const mockUsers = [
      "TechGuru42", "DataNinja", "CodeMaster", "AIEnthusiast", "DevLife", "StartupFounder", "ProductManager", "UXDesigner"
    ]

    return Array.from({ length: Math.min(comment.replyCount, 3) }, (_, i) => ({
      id: `reply_${comment.id}_${i}`,
      content: mockReplies[i % mockReplies.length],
      authorDisplayName: mockUsers[i % mockUsers.length],
      likeCount: Math.floor(Math.random() * 20) + 1,
      publishedDate: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 flex flex-col relative overflow-hidden">
      {/* Simplified background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 dark:bg-blue-600/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/5 dark:bg-purple-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grain texture */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:30px_30px]"></div>
      </div>


      {/* Middle View - Centered Layout */}
      <main className="flex-1 flex items-center justify-center p-1 md:p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-4 md:mb-8 mt-8 md:mt-12">
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
              <span className="inline-block">Brief</span><span className="inline-block text-blue-600 dark:text-blue-400" style={{marginLeft: '1px'}}>
                <span className="inline-block animate-[bounceHighI_2s_ease-in-out_infinite]" style={{animationDelay: '100ms'}}>i</span><span className="inline-block animate-[bounceHigh_2s_ease-in-out_infinite]" style={{animationDelay: '400ms'}}>f</span><span className="inline-block animate-[bounceHigh_2s_ease-in-out_infinite]" style={{animationDelay: '550ms'}}>y</span>
              </span>
            </h1>
            <div className="mb-6">
              <p className="text-xl font-light italic tracking-wide font-serif bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 dark:from-slate-400 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent">
                <em>brief</em>&nbsp;insights for you
              </p>
            </div>
          </div>

          {(loadingStage === 'idle' || loadingStage === 'fetching') && (
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transition-all duration-700 ease-in-out">
              <VideoInputForm
                url={url}
                isLoading={isLoading}
                loadingText={loadingText}
                currentHeroText={currentHeroText}
                isWorkshopMode={isWorkshopMode}
                loadingStage={loadingStage}
                isVibeMode={isVibeMode}
                onUrlChange={setUrl}
                onGetStarted={handleGetStarted}
                onHoverLoader={setHoveringLoader}
              />
            </div>
          )}

          {/* Video card or placeholder */}
          {loadingStage === 'fetching' ? (
            <div className="px-1.5 md:px-4">
              {/* Hero Video Card Placeholder */}
              <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-900/50 border border-gray-700/30 animate-pulse">
                <div className="relative z-10 px-3 md:px-6 py-1 md:py-3 pb-4 md:pb-6 min-h-[160px] flex flex-col justify-end space-y-3">
                  {/* Title placeholder */}
                  <div className="h-6 bg-gray-700/60 rounded-lg w-4/5 animate-pulse"></div>
                  <div className="space-y-2">
                    {/* Author placeholder */}
                    <div className="h-4 bg-gray-700/40 rounded w-1/3"></div>
                    {/* Stats placeholder */}
                    <div className="flex items-center space-x-3">
                      <div className="h-3 bg-gray-700/40 rounded w-20"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="h-3 bg-gray-700/40 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights Placeholder */}
              <div className="mb-8">
                <div className="h-5 bg-gray-700/40 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="relative p-4 bg-gradient-to-r from-slate-800/50 via-slate-700/45 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/20 animate-pulse">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-6 bg-gray-600/50 rounded-full w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-600/40 rounded w-full"></div>
                        <div className="h-4 bg-gray-600/40 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-600/40 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Section Placeholder */}
              <div className="mb-8">
                <div className="h-5 bg-gray-700/40 rounded w-40 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2].map((index) => (
                    <div key={index} className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-600/50 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-600/40 rounded w-24"></div>
                          <div className="h-4 bg-gray-600/30 rounded w-full"></div>
                          <div className="h-4 bg-gray-600/30 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : videoData && (
            <div className="px-1.5 md:px-4">
              <VideoCard
                videoData={videoData}
                loadingStage={loadingStage}
                isFavorited={false}
                isVibeMode={isVibeMode}
                onToggleFavorite={() => {}}
              />
            </div>
          )}

          {/* Key Insights section */}
          {videoData && (loadingStage === 'insights' || loadingStage === 'comments' || loadingStage === 'complete') && (
            <div className="px-1.5 md:px-4 mb-8">
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
                      className="relative p-4 bg-gradient-to-r from-slate-800/90 via-slate-700/85 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
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
                              href={`https://www.youtube.com/watch?v=${videoData?.id}&t=${insight.timeParam}`}
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

                  {/* Load More/Collapse Button */}
                  <div className="mt-3">
                    {loadingStage === 'complete' ? (
                      <button
                        onClick={showAISummary ? toggleAISummary : loadMoreInsights}
                        className="w-full relative p-4 bg-gradient-to-r from-slate-800/90 via-slate-700/85 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
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
                    ) : (
                      visibleInsights < allInsights.length && (
                        <button
                          onClick={loadMoreInsights}
                          className="w-full relative p-4 bg-gradient-to-r from-slate-800/90 via-slate-700/85 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-600/30 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                        >
                          {/* Inner grain texture */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                                <span className="text-sm text-gray-200 font-medium">Show more</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">+</div>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments section */}
          {videoData && (loadingStage === 'comments' || loadingStage === 'complete') && (
            <div className="px-1.5 md:px-4">
              <CommentViewer
                videoData={videoData}
                activeCommentView={activeCommentView}
                favoriteAuthors={favoriteAuthors}
                isVibeMode={isVibeMode}
                getCommentSummary={getCommentSummary}
                getCommentsByView={getCommentsByView}
                handleCommentClick={handleCommentClick}
                toggleFavoriteComment={toggleFavoriteComment}
                toggleFavoriteAuthor={toggleFavoriteAuthor}
                isCommentFavorited={isCommentFavorited}
                isAuthorFavorited={isAuthorFavorited}
                trackEvent={trackEvent}
              />
            </div>
          )}

          {/* Analyze Another URL section */}
          {videoData && loadingStage === 'complete' && (
            <div className="px-1.5 md:px-4 mt-16 mb-12">
              <div className="relative p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-600/30 overflow-hidden shadow-2xl">
                {/* Grainy texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                {/* Subtle glow gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                {/* Light gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                {/* Glass highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-transparent opacity-60"></div>

                <div className="relative z-10 text-center">
                  <button
                    onClick={async () => {
                      try {
                        // Load next video from quick-load.json
                        const response = await fetch('/sample-videos/quick-load.json');
                        const data = await response.json();

                        const currentVideoId = videoData?.id;
                        const videos = data.quickLoadVideos;
                        const currentIndex = videos.findIndex(v => v.id === currentVideoId);
                        const nextVideo = videos[(currentIndex + 1) % videos.length];

                        // Load the next video's JSON data directly
                        const videoResponse = await fetch(`/sample-videos/${nextVideo.id}.json`);
                        const nextVideoData = await videoResponse.json();

                        // Update state with new video data
                        setUrl(nextVideo.url);
                        setVideoData(nextVideoData);

                        // Track the event
                        trackEvent('video_cycled', {
                          from_video_id: currentVideoId,
                          to_video_id: nextVideo.id,
                          to_video_url: nextVideo.url
                        });

                      } catch (error) {
                        console.error('Error loading next video:', error);
                      }
                    }}
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Inner grain texture */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:15px_15px] opacity-40"></div>
                    {/* Glass highlight */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    {/* Bottom highlight */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent"></div>
                    <span className="relative z-10 tracking-wide">Analyze another URL</span>
                    <svg className="relative z-10 ml-2 w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <p className="text-sm text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
                    Explore more AI videos from our curated collection
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacing for main content */}
        <div className="h-16"></div>
      </main>

      {/* Bottom right control panel */}
      <div className="fixed bottom-6 right-6 z-50">
        {isWorkshopMode ? (
          /* Workshop Panel */
          <div className="relative bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 w-64 overflow-hidden">
            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-transparent to-slate-900/30 pointer-events-none"></div>
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full relative z-10 shadow-sm shadow-blue-400/40" style={{animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
                    <div className="absolute inset-0 w-1.5 h-1.5 bg-blue-300/20 rounded-full" style={{animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'}}></div>
                    <div className="absolute inset-[-1px] w-2.5 h-2.5 bg-blue-400/15 rounded-full blur-[1px]" style={{animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'}}></div>
                  </div>
                  <span className="text-sm font-medium text-white">Workshop Mode</span>
                </div>
                <button
                  onClick={() => setIsWorkshopMode(false)}
                  className="text-slate-400 hover:text-white transition-colors duration-200 p-1"
                  title="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-1">
              {/* Feedback Row */}
              <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">Feedback</span>
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 rounded-md hover:bg-slate-700/50 transition-all duration-200 text-base" title="Thumbs Up">
                    👍
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-slate-700/50 transition-all duration-200 text-base" title="Thumbs Down">
                    👎
                  </button>
                </div>
              </div>

              {/* Stage Row */}
              <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">Stage</span>
                <span className="text-xs text-blue-400 font-medium capitalize">
                  {loadingStage === 'idle' ? 'Initial' : loadingStage}
                </span>
              </div>

              {/* Navigation Row */}
              <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">Controls</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={goToBeginning}
                    className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="Back to Beginning"
                  >
                    <ChevronDoubleLeftIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={prevStage}
                    className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="Previous Step"
                  >
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={nextStage}
                    className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="Next Step"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={goToEnd}
                    className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="End of Flow"
                  >
                    <ChevronDoubleRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Vibe Mode Row */}
              <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">Vibe Mode</span>
                <button
                  onClick={() => setIsVibeMode(!isVibeMode)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                    isVibeMode ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                  title={isVibeMode ? "Disable component labels" : "Show component labels"}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                      isVibeMode ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Theme Options Row */}
              <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200 group">
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">Theme</span>
                <div className="flex items-center space-x-1">
                  {/* Light Theme */}
                  <button className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200" title="Light Theme">
                    <SunIcon className="w-3.5 h-3.5" />
                  </button>
                  {/* Dark Theme */}
                  <button className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200" title="Dark Theme">
                    <MoonIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed Controls */
          <div className="flex flex-col items-center space-y-3">
            <ThemeToggle />
            <button
              onClick={() => setIsWorkshopMode(true)}
              className="p-3 rounded-full bg-slate-900/90 dark:bg-slate-800/90 hover:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Open workshop"
              title="Workshop Mode"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Text Art Footer - Cosmic Scene */}
      <footer className="mt-auto px-4 py-8 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent">
        <div className="relative max-w-4xl mx-auto">
          {/* Dense Cosmic Scene - Only show when at bottom */}
          {showStars && (
            <div className="text-center mb-12 space-y-1 transition-opacity duration-1000 ease-in-out">
              <div className="text-gray-500/40 font-mono text-xs leading-tight">
                <div>    ✦       ⋆          ✧      ⋆        ✦          ✧         ⋆       ✦      ✧    ⋆     ✦   </div>
                <div>      ⋆  ✧      ○    ✦     ⋆     ✧       ✦     ⋆         ✧    ✦      ⋆      ✧       ✦   </div>
                <div>  ✧    ✦      ⋆       ✧     ✦      ⋆      ✧        ✦   ⋆     ✧        ✦   ⋆       ✧    </div>
                <div>     ⋆     ✧    ✦        ⋆    ✧     ✦      ⋆    ✧       ✦     ⋆       ✧    ✦     ⋆     </div>
                <div>  ✦    ⋆      ✧     ✦      ⋆    ✧       ✦      ⋆     ✧        ✦   ⋆      ✧       ✦    </div>
                <div>      ✧      ✦    ⋆      ✧       ✦     ⋆        ✧    ✦      ⋆     ✧        ✦     ⋆   </div>
                <div>  ⋆     ✦    ✧       ⋆       ✦    ✧      ⋆        ✦      ✧    ⋆       ✦    ✧     ⋆   </div>
                <div>    ✧      ⋆       ✦    ✧       ⋆     ✦       ✧       ⋆     ✦     ✧       ⋆     ✦    </div>
                <div>  ✦     ✧       ⋆      ✦     ✧      ⋆       ✦     ✧       ⋆      ✦    ✧      ⋆      ✦  </div>
                <div>      ⋆     ✦       ✧      ⋆    ◐     ✦      ✧      ⋆       ✦     ✧      ⋆       ✦   </div>
                <div>  ✧       ⋆     ✦      ✧      ⋆     ✦       ✧      ⋆     ✦       ✧      ⋆     ✦     ✧ </div>
                <div>    ✦    ✧      ⋆       ✦     ✧       ⋆     ✦       ✧       ⋆    ✦      ✧     ⋆      </div>
                <div>  ⋆       ✦    ✧      ⋆       ✦      ✧      ⋆     ✦       ✧      ⋆      ✦    ✧       </div>
                <div>      ✧     ⋆      ✦      ✧      ⋆       ✦     ✧      ⋆     ✦      ✧      ⋆       ✦  </div>
                <div>  ✦       ✧     ⋆       ✦      ✧       ⋆      ✦     ✧      ⋆       ✦    ✧      ⋆    </div>
                <div>    ⋆      ✦    ✧       ⋆     ✦      ✧       ⋆     ✦      ✧       ⋆     ✦     ✧     </div>
                <div>  ✧       ⋆      ✦     ✧      ⋆       ✦      ✧     ⋆       ✦     ✧       ⋆      ✦   </div>
                <div>    ✦     ✧       ⋆      ✦    ●      ✧      ⋆     ✦       ✧      ⋆      ✦     ✧     </div>
              </div>
            </div>
          )}

          {/* Copyright and Branding */}
          <div className="text-center mt-8 space-y-3">
            <div className="text-gray-500/50 text-xs">
              © 2025 Briefify • Transform content into insights
            </div>
            <div className="text-gray-600/40 text-xs font-mono">
              ⚡ Powered by AI • Built for creators
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}