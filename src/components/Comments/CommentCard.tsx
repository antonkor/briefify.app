'use client'

import { trackEvent } from '@/lib/posthog'
import { GlassCard } from '@/components/UI/GlassCard'

interface Comment {
  id: string
  authorDisplayName: string
  content: string
  likeCount: number
  replyCount: number
}

interface CommentCardProps {
  comment: Comment
  onCommentClick: (comment: Comment, event: React.MouseEvent) => void
  onFavoriteToggle: (commentId: string, isRemoving: boolean, section: string) => void
  isFavorited: boolean
  section: string
  showEngagementScore?: boolean
}

export function CommentCard({
  comment,
  onCommentClick,
  onFavoriteToggle,
  isFavorited,
  section,
  showEngagementScore = true
}: CommentCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavoriteToggle(comment.id, isFavorited, section)

    // Track favorite action
    trackEvent('comment_favorited', {
      action: isFavorited ? 'remove' : 'add',
      comment_author: comment.authorDisplayName,
      section
    })
  }

  return (
    <GlassCard
      onClick={(e) => onCommentClick(comment, e)}
      variant="interactive"
      className="block w-full text-left p-3"
    >
      <div className="p-1">
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
            onClick={handleFavoriteClick}
            className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400 group-hover/star:text-yellow-400'
              }`}
              fill={isFavorited ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
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

            {showEngagementScore && (
              <div className="flex items-center space-x-1 text-gray-500" title="Engagement score">
                <span>📈</span>
                <span className="font-medium">{Math.floor(Math.random() * 50) + 1}</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 italic">
            {/* Future: Add comment insights here */}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}