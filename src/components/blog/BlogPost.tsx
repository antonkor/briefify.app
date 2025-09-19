'use client'

import { BlogPost as BlogPostType } from '@/types/blog'
import { formatDate, getCategoryColor } from '@/utils/blog'
import { BlogCard } from './BlogCard'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface BlogPostProps {
  post: BlogPostType
  relatedPosts?: BlogPostType[]
}

export function BlogPost({ post, relatedPosts = [] }: BlogPostProps) {
  const categoryColor = getCategoryColor(post.category)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span
            className="px-3 py-1 text-sm font-medium rounded-full text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {post.category}
          </span>
          {post.featured && (
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              Featured
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {post.excerpt}
        </p>

        {/* Meta info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {post.author.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {post.author.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.author.role}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {/* Code examples */}
      {post.codeExamples && post.codeExamples.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Code Examples
          </h2>
          <div className="space-y-6">
            {post.codeExamples.map((example, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-gray-200">
                    {example.title}
                  </h3>
                </div>
                <SyntaxHighlighter
                  style={tomorrow}
                  language={example.language}
                  customStyle={{
                    margin: 0,
                    background: 'transparent'
                  }}
                >
                  {example.code}
                </SyntaxHighlighter>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Posts
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}