'use client'

import { BlogList } from '@/components/blog/BlogList'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getAllPosts, getCategories, getTags } from '@/utils/blog'
import Link from 'next/link'

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getCategories()
  const tags = getTags()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span style={{ letterSpacing: '0.5px' }}>Brief</span>
              <span className="relative inline-block opacity-80" style={{ marginLeft: '1px' }}>
                <span className="inline-block">i</span>
                <span className="inline-block">f</span>
                <span className="inline-block">y</span>
              </span>
            </Link>
            <span className="text-gray-400 dark:text-gray-600">/</span>
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Blog
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Development Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, tutorials, and behind-the-scenes stories from building Briefify
          </p>
        </div>

        {/* Blog list */}
        <BlogList posts={posts} categories={categories} tags={tags} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Briefify. Built with Next.js and passion for great user experiences.
          </p>
        </div>
      </footer>
    </div>
  )
}