import { useState } from 'react'

/**
 * Custom hook for managing comment interactions and view filtering
 * Handles comment view switching, comment selection, and comment filtering logic
 */
export const useCommentInteractions = () => {
  const [activeCommentView, setActiveCommentView] = useState('summary')
  const [selectedComment, setSelectedComment] = useState(null)

  // Handle comment click to show details
  const handleCommentClick = (comment: any, e: any) => {
    e.preventDefault()
    setSelectedComment(comment)
  }

  // Filter comments based on active view
  const getCommentsByView = (videoData: any, favoriteAuthors: Set<string>) => {
    if (!videoData) return []

    switch (activeCommentView) {
      case 'top':
        return (videoData as any).comments.comments.slice(0, 10)

      case 'insights':
        return (videoData as any).comments.comments.filter((c: any) => {
          const content = c.content.toLowerCase()
          const insightKeywords = [
            'ai', 'future', 'tech', 'innovation', 'breakthrough', 'solution',
            'analysis', 'perspective', 'insight', 'understanding', 'deep',
            'profound', 'realize', 'discover', 'reveals', 'explains', 'theory',
            'concept', 'principle', 'methodology', 'approach', 'strategy',
            'implications', 'consequences', 'significance', 'impact', 'evolution',
            'transformation', 'paradigm', 'framework', 'model', 'system'
          ]
          const hasInsightKeywords = insightKeywords.some(keyword => content.includes(keyword))
          const hasQuestions = c.content.includes('?') && c.content.length > 50
          const hasDeepThought = c.content.length > 100 && (
            content.includes('think') || content.includes('believe') || content.includes('opinion')
          )
          const hasHighEngagement = c.likeCount > 20 || c.replyCount > 3
          return (hasInsightKeywords || hasQuestions || hasDeepThought) && hasHighEngagement
        }).slice(0, 8)

      case 'loved':
        return (videoData as any).comments.comments.filter((c: any) =>
          c.likeCount > 50 && (
            c.content.includes('!') ||
            c.content.toLowerCase().includes('amazing') ||
            c.content.toLowerCase().includes('great')
          )
        ).slice(0, 8)

      case 'mixed':
        return (videoData as any).comments.comments.filter((c: any) =>
          favoriteAuthors.has(c.authorDisplayName)
        ).slice(0, 8)

      case 'debates':
        return (videoData as any).comments.comments.filter((c: any) =>
          c.content.toLowerCase().includes('but') ||
          c.content.toLowerCase().includes('however') ||
          c.content.toLowerCase().includes('concern') ||
          c.replyCount > 5 ||
          c.content.includes('?')
        ).slice(0, 8)

      default:
        return (videoData as any).comments.comments.slice(0, 10)
    }
  }

  // Get comment summary for different views
  const getCommentSummary = (videoData: any) => {
    if (!videoData) return null

    const topComments = (videoData as any).comments.comments.slice(0, 3)
    const insightComments = (videoData as any).comments.comments.filter((c: any) =>
      c.content.toLowerCase().includes('ai') ||
      c.content.toLowerCase().includes('future') ||
      c.content.toLowerCase().includes('tech')
    ).slice(0, 3)
    const lovedComments = (videoData as any).comments.comments.filter((c: any) =>
      c.likeCount > 50 && (
        c.content.includes('!') ||
        c.content.toLowerCase().includes('amazing') ||
        c.content.toLowerCase().includes('great')
      )
    ).slice(0, 3)
    const mixedComments = (videoData as any).comments.comments.filter((c: any) =>
      c.content.toLowerCase().includes('but') ||
      c.content.toLowerCase().includes('however') ||
      c.content.toLowerCase().includes('concern')
    ).slice(0, 3)
    const debateComments = (videoData as any).comments.comments.filter((c: any) =>
      c.replyCount > 5 || c.content.includes('?')
    ).slice(0, 3)

    return {
      topComments,
      insightComments,
      lovedComments,
      mixedComments,
      debateComments
    }
  }

  // Helper to get estimated timestamp for a comment
  const getCommentTimestamp = (comment: any, videoData: any) => {
    if (!videoData || !(videoData as any).comments?.comments) return '0:00'
    const commentIndex = (videoData as any).comments.comments.findIndex((c: any) => c.id === comment.id)
    const estimatedTime = Math.floor((commentIndex / (videoData as any).comments.comments.length) * (videoData as any).length)
    const minutes = Math.floor(estimatedTime / 60)
    const seconds = estimatedTime % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    // State
    activeCommentView,
    selectedComment,

    // Actions
    setActiveCommentView,
    setSelectedComment,
    handleCommentClick,
    getCommentsByView,
    getCommentSummary,
    getCommentTimestamp
  }
}