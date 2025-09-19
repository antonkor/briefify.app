import { BlogPost, BlogData, BlogFilters } from '@/types/blog'
import blogData from '@/data/blog-posts.json'

export function getAllPosts(): BlogPost[] {
  return (blogData as BlogData).posts.filter(post => post.status === 'published')
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter(post => post.featured)
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find(post => post.slug === slug) || null
}

export function getPostsByCategory(categoryId: string): BlogPost[] {
  return getAllPosts().filter(post => post.category === categoryId)
}

export function getPostsByTag(tagId: string): BlogPost[] {
  return getAllPosts().filter(post => post.tags.includes(tagId))
}

export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts().filter(post => post.id !== currentPost.id)

  // Score posts based on shared tags and category
  const scoredPosts = allPosts.map(post => {
    let score = 0

    // Same category gets higher score
    if (post.category === currentPost.category) {
      score += 3
    }

    // Shared tags get points
    const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag))
    score += sharedTags.length

    return { post, score }
  })

  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post)
}

export function filterPosts(posts: BlogPost[], filters: BlogFilters): BlogPost[] {
  let filtered = [...posts]

  if (filters.category) {
    filtered = filtered.filter(post => post.category === filters.category)
  }

  if (filters.tag) {
    filtered = filtered.filter(post => post.tags.includes(filters.tag))
  }

  if (filters.featured !== undefined) {
    filtered = filtered.filter(post => post.featured === filters.featured)
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  return filtered
}

export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase()
  return getAllPosts().filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.author.name.toLowerCase().includes(searchTerm)
  )
}

export function getCategories() {
  return (blogData as BlogData).categories
}

export function getTags() {
  return (blogData as BlogData).tags
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function generateBlogUrl(slug: string): string {
  return `/blog/${slug}`
}

export function getCategoryColor(categoryId: string): string {
  const category = getCategories().find(cat => cat.id === categoryId)
  return category?.color || '#6B7280'
}