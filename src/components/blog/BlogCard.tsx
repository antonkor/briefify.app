'use client'

import { BlogPost } from '@/types/blog'
import { formatDate, getCategoryColor } from '@/utils/blog'
import Link from 'next/link'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryColor = getCategoryColor(post.category)

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className={`relative p-4 md:p-6 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md rounded-xl md:rounded-2xl border border-slate-600/40 shadow-lg overflow-hidden hover:shadow-xl hover:border-slate-400/60 transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>

        {/* Gradient highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-60"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span
                className="px-2 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {post.category}
              </span>
              {post.featured && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  Featured
                </span>
              )}
            </div>
            <time className="text-xs text-gray-400">
              {formatDate(post.publishedAt)}
            </time>
          </div>

          {/* Title and excerpt */}
          <h2 className={`font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-white transition-colors ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>
            {post.title}
          </h2>

          <p className={`text-gray-300 leading-relaxed mb-4 ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-700/50 text-gray-300 rounded-md"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-700/30 text-gray-400 rounded-md">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-600/30">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-200">
                  {post.author.name}
                </div>
                <div className="text-xs text-gray-400">
                  {post.author.role}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {post.readingTime} min read
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}