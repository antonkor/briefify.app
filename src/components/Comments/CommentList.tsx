'use client'

import { CommentCard } from './CommentCard'

interface Comment {
  id: string
  authorDisplayName: string
  content: string
  likeCount: number
  replyCount: number
}

interface CommentListProps {
  title: string
  comments: Comment[]
  onCommentClick: (comment: Comment, event: React.MouseEvent) => void
  onFavoriteToggle: (commentId: string, isRemoving: boolean, section: string) => void
  favoritedComments: Set<string>
  section: string
  showEngagementScore?: boolean
}

export function CommentList({
  title,
  comments,
  onCommentClick,
  onFavoriteToggle,
  favoritedComments,
  section,
  showEngagementScore = true
}: CommentListProps) {
  if (comments.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h4>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onCommentClick={onCommentClick}
            onFavoriteToggle={onFavoriteToggle}
            isFavorited={favoritedComments.has(comment.id)}
            section={section}
            showEngagementScore={showEngagementScore}
          />
        ))}
      </div>
    </div>
  )
}