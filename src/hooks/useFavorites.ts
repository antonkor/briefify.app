import { useState } from 'react'

/**
 * Custom hook for managing favorites (comments and authors)
 * Handles favoriting/unfavoriting comments and authors with proper event handling
 */
export const useFavorites = () => {
  const [favoritedComments, setFavoritedComments] = useState(new Set<string>())
  const [favoriteAuthors, setFavoriteAuthors] = useState(new Set<string>())

  // Toggle favorite status for a comment
  const toggleFavoriteComment = (commentId: string, e: any, trackEvent?: Function) => {
    e.stopPropagation()
    setFavoritedComments(prev => {
      const newSet = new Set(prev)
      const isRemoving = newSet.has(commentId)

      if (isRemoving) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }

      // Track favorite action if tracking function provided
      if (trackEvent) {
        trackEvent('comment_favorited', {
          comment_id: commentId,
          action: isRemoving ? 'unfavorited' : 'favorited',
          total_favorites: newSet.size
        })
      }

      return newSet
    })
  }

  // Toggle favorite status for an author
  const toggleFavoriteAuthor = (authorName: string, e: any, trackEvent?: Function) => {
    e.stopPropagation()
    setFavoriteAuthors(prev => {
      const newSet = new Set(prev)
      const isRemoving = newSet.has(authorName)

      if (isRemoving) {
        newSet.delete(authorName)
      } else {
        newSet.add(authorName)
      }

      // Track favorite action if tracking function provided
      if (trackEvent) {
        trackEvent('author_favorited', {
          author_name: authorName,
          action: isRemoving ? 'unfavorited' : 'favorited',
          total_favorites: newSet.size
        })
      }

      return newSet
    })
  }

  // Check if a comment is favorited
  const isCommentFavorited = (commentId: string) => {
    return favoritedComments.has(commentId)
  }

  // Check if an author is favorited
  const isAuthorFavorited = (authorName: string) => {
    return favoriteAuthors.has(authorName)
  }

  // Reset all favorites
  const resetFavorites = () => {
    setFavoritedComments(new Set())
    setFavoriteAuthors(new Set())
  }

  // Get favorite counts
  const getFavoriteCounts = () => {
    return {
      comments: favoritedComments.size,
      authors: favoriteAuthors.size,
      total: favoritedComments.size + favoriteAuthors.size
    }
  }

  // Get favorited comments from a list
  const getFavoritedComments = (comments: any[]) => {
    return comments.filter(comment => favoritedComments.has(comment.id))
  }

  // Get comments by favorite authors from a list
  const getCommentsByFavoriteAuthors = (comments: any[]) => {
    return comments.filter(comment => favoriteAuthors.has(comment.authorDisplayName))
  }

  return {
    // State
    favoritedComments,
    favoriteAuthors,

    // Actions
    toggleFavoriteComment,
    toggleFavoriteAuthor,
    isCommentFavorited,
    isAuthorFavorited,
    resetFavorites,
    getFavoriteCounts,
    getFavoritedComments,
    getCommentsByFavoriteAuthors,

    // Setters (for direct manipulation when needed)
    setFavoritedComments,
    setFavoriteAuthors
  }
}