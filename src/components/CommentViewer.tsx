import { ComponentLabel } from './ComponentLabel'

interface CommentViewerProps {
  videoData: any
  activeCommentView: string
  favoriteAuthors: Set<string>
  isVibeMode?: boolean
  getCommentSummary: (videoData: any) => any
  getCommentsByView: (videoData: any, favoriteAuthors: Set<string>) => any[]
  handleCommentClick: (comment: any, e: any) => void
  toggleFavoriteComment: (commentId: string, e: any, trackEvent?: Function) => void
  toggleFavoriteAuthor: (authorName: string, e: any, trackEvent?: Function) => void
  isCommentFavorited: (commentId: string) => boolean
  isAuthorFavorited: (authorName: string) => boolean
  trackEvent: Function
}

export const CommentViewer = ({
  videoData,
  activeCommentView,
  favoriteAuthors,
  isVibeMode = false,
  getCommentSummary,
  getCommentsByView,
  handleCommentClick,
  toggleFavoriteComment,
  toggleFavoriteAuthor,
  isCommentFavorited,
  isAuthorFavorited,
  trackEvent
}: CommentViewerProps) => {
  // Get comments for each category using the hook
  if (!videoData) return null
  const commentSummary = getCommentSummary(videoData)
  if (!commentSummary) return null
  const { topComments, insightComments, lovedComments, mixedComments, debateComments } = commentSummary

  if (activeCommentView === 'summary') {
    return (
      <div className="space-y-4 relative">
        <ComponentLabel name="CommentViewer" isVisible={isVibeMode} position="top-right" />

        {/* Comment Sorting Bar */}
        <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-600/30 p-1 overflow-hidden">
          {/* Noise effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
          <div className="relative z-10 flex items-center justify-center space-x-1">
            <button className="flex flex-col items-center px-3 py-2 rounded-lg text-white transition-all duration-200">
              <span className="text-lg mb-1">💬</span>
              <span className="text-xs font-medium">Briefs</span>
            </button>
            <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400/50 hover:text-white transition-all duration-200">
              <span className="text-lg mb-1">🔥</span>
              <span className="text-xs font-medium">Top</span>
            </button>
            <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400/50 hover:text-white transition-all duration-200">
              <span className="text-lg mb-1">💡</span>
              <span className="text-xs font-medium">Insights</span>
            </button>
            <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400/50 hover:text-white transition-all duration-200">
              <span className="text-lg mb-1">⭐</span>
              <span className="text-xs font-medium">Stars</span>
            </button>
            <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400/50 hover:text-white transition-all duration-200">
              <span className="text-lg mb-1">👥</span>
              <span className="text-xs font-medium">Following</span>
            </button>
            <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400/50 hover:text-white transition-all duration-200">
              <span className="text-lg mb-1">⚡</span>
              <span className="text-xs font-medium">Mixed</span>
            </button>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="relative p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
          <div className="relative z-10">
            <div className="mb-4">
              <span className="text-xs font-mono px-3 py-1 rounded-full border text-gray-300 bg-gray-500/20 border-gray-500/30">
                {(videoData as any).comments.totalCount} comments analyzed
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed mb-1">
              Most viewers are excited about the AI-driven payment system, with many discussing its potential impact on traditional finance. Some express concerns about regulation and oversight, while others see early adoption opportunities.
            </p>
          </div>
        </div>

        {/* Top Comments Preview */}
        <div className="px-1.5 md:px-4">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            Most Popular
          </h4>
          <div className="space-y-4">
            {topComments.map((comment: any, index: number) => (
              <div
                key={comment.id}
                onClick={(e) => handleCommentClick(comment, e)}
                className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
              >
                {/* Grainy texture overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                {/* Subtle glow gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
                {/* Light gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
                <div className="relative z-10 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-300">
                        {comment.authorDisplayName.replace('@', '')}
                      </span>
                    </div>
                    <button
                      onClick={(e) => toggleFavoriteComment(comment.id, e, trackEvent)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                      title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg className={`w-3 h-3 transition-colors ${
                        isCommentFavorited(comment.id)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400 group-hover/star:text-yellow-400'
                      }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <span className="text-yellow-400">👍</span>
                    <span className="font-medium">{comment.likeCount}</span>
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
                  className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                >
                  {/* Grainy texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                  {/* Subtle glow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent via-transparent to-blue-500/5 opacity-60"></div>
                  {/* Light gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent"></div>
                  <div className="relative z-10 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {comment.authorDisplayName.replace('@', '')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFavoriteComment(comment.id, e)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                        title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg className={`w-3 h-3 transition-colors ${
                          isCommentFavorited(comment.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
                        }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <span className="text-yellow-400">👍</span>
                      <span className="font-medium">{comment.likeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Favorites Preview */}
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
                  className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                >
                  {/* Grainy texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                  {/* Subtle glow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent via-transparent to-red-500/5 opacity-60"></div>
                  {/* Light gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
                  <div className="relative z-10 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {comment.authorDisplayName.replace('@', '')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFavoriteComment(comment.id, e)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                        title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg className={`w-3 h-3 transition-colors ${
                          isCommentFavorited(comment.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
                        }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <span className="text-yellow-400">👍</span>
                      <span className="font-medium">{comment.likeCount}</span>
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
                  className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                >
                  {/* Grainy texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                  {/* Subtle glow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent via-transparent to-red-500/5 opacity-60"></div>
                  {/* Light gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/20 to-transparent"></div>
                  <div className="relative z-10 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {comment.authorDisplayName.replace('@', '')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFavoriteComment(comment.id, e)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                        title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg className={`w-3 h-3 transition-colors ${
                          isCommentFavorited(comment.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
                        }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <span className="text-yellow-400">👍</span>
                      <span className="font-medium">{comment.likeCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debate Comments Preview */}
        {debateComments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Debate & Discussion
            </h4>
            <div className="space-y-4">
              {debateComments.map((comment: any, index: number) => (
                <div
                  key={comment.id}
                  onClick={(e) => handleCommentClick(comment, e)}
                  className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
                >
                  {/* Grainy texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
                  {/* Subtle glow gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent via-transparent to-pink-500/5 opacity-60"></div>
                  {/* Light gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
                  <div className="relative z-10 p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gray-600/40 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-300">
                          {comment.authorDisplayName.replace('@', '')}
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleFavoriteComment(comment.id, e)}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors group/star"
                        title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg className={`w-3 h-3 transition-colors ${
                          isCommentFavorited(comment.id)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
                        }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <span className="text-yellow-400">👍</span>
                      <span className="font-medium">{comment.likeCount}</span>
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

  // Use the hook's getCommentsByView function
  const filteredCommentsData = getCommentsByView(videoData, favoriteAuthors)

  return (
    <div className="space-y-4 relative">
      <ComponentLabel name="CommentViewer" isVisible={isVibeMode} position="top-right" />

      {/* Comments Section Header */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>

      {/* Comment Sorting Bar */}
      <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-600/30 p-1 overflow-hidden">
        {/* Noise effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center space-x-1">
          <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400 hover:text-white transition-all duration-200">
            <span className="text-lg mb-1">📊</span>
            <span className="text-xs font-medium">Summary</span>
          </button>
          <button className="flex flex-col items-center px-3 py-2 rounded-lg bg-slate-700/50 text-white transition-all duration-200">
            <span className="text-lg mb-1">🔥</span>
            <span className="text-xs font-medium">Top</span>
          </button>
          <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400 hover:text-white transition-all duration-200">
            <span className="text-lg mb-1">💡</span>
            <span className="text-xs font-medium">Insights</span>
          </button>
          <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400 hover:text-white transition-all duration-200">
            <span className="text-lg mb-1">⭐</span>
            <span className="text-xs font-medium">Stars</span>
          </button>
          <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400 hover:text-white transition-all duration-200">
            <span className="text-lg mb-1">👥</span>
            <span className="text-xs font-medium">Following</span>
          </button>
          <button className="flex flex-col items-center px-3 py-2 rounded-lg hover:bg-slate-700/30 text-gray-400 hover:text-white transition-all duration-200">
            <span className="text-lg mb-1">⚡</span>
            <span className="text-xs font-medium">Mixed</span>
          </button>
        </div>
      </div>

      {filteredCommentsData.map((comment: any, index: number) => (
        <div
          key={comment.id}
          onClick={(e) => handleCommentClick(comment, e)}
          className="block w-full text-left relative p-1.5 md:p-4 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-md rounded-xl border border-slate-600/30 overflow-hidden hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-500 group cursor-pointer"
        >
          {/* Grainy texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:24px_24px] opacity-20"></div>
          {/* Subtle glow gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent via-transparent to-purple-500/5 opacity-60"></div>
          {/* Light gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
          <div className="relative z-10 p-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-gray-600/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-200 tracking-wide">
                  {comment.authorDisplayName.replace('@', '')}
                </span>
                <button
                  onClick={(e) => toggleFavoriteAuthor(comment.authorDisplayName, e)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors group/author"
                  title={isAuthorFavorited(comment.authorDisplayName) ? "Remove author from favorites" : "Add author to favorites"}
                >
                  <svg className={`w-3 h-3 transition-colors ${
                    isAuthorFavorited(comment.authorDisplayName)
                      ? 'text-purple-400 fill-purple-400'
                      : 'text-gray-500 group-hover/author:text-purple-400'
                  }`} fill={isAuthorFavorited(comment.authorDisplayName) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
              <button
                onClick={(e) => toggleFavoriteComment(comment.id, e)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors group/star"
                title={isCommentFavorited(comment.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <svg className={`w-4 h-4 transition-colors ${
                  isCommentFavorited(comment.id)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-400 group-hover/star:text-yellow-400'
                }`} fill={isCommentFavorited(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}