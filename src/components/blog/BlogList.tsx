'use client'

import { useState } from 'react'
import { BlogPost, BlogCategory, BlogTag, BlogFilters } from '@/types/blog'
import { BlogCard } from './BlogCard'
import { BlogFilters as BlogFiltersComponent } from './BlogFilters'
import { filterPosts } from '@/utils/blog'

interface BlogListProps {
  posts: BlogPost[]
  categories: BlogCategory[]
  tags: BlogTag[]
}

export function BlogList({ posts, categories, tags }: BlogListProps) {
  const [filters, setFilters] = useState<BlogFilters>({})
  const filteredPosts = filterPosts(posts, filters)
  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="space-y-8">
      {/* Filters */}
      <BlogFiltersComponent
        categories={categories}
        tags={tags}
        currentFilters={filters}
        onFilterChange={setFilters}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {Object.keys(filters).length > 0 ? 'Filtered Results' : 'Latest Posts'}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* No results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No posts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => setFilters({})}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Featured
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured />
            ))}
          </div>
        </div>
      )}

      {/* Regular posts */}
      {regularPosts.length > 0 && (
        <div className="space-y-6">
          {featuredPosts.length > 0 && (
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              More Posts
            </h3>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}