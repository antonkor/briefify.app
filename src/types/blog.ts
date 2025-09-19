export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
  publishedAt: string
  updatedAt: string
  tags: string[]
  category: string
  featured: boolean
  readingTime: number
  status: 'draft' | 'published' | 'archived'
  metadata: {
    seoTitle: string
    seoDescription: string
    socialImage: string
    keywords: string[]
  }
  relatedSpecs?: string[]
  codeExamples?: CodeExample[]
}

export interface CodeExample {
  language: string
  title: string
  code: string
}

export interface BlogCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface BlogTag {
  id: string
  name: string
  count: number
}

export interface BlogData {
  posts: BlogPost[]
  categories: BlogCategory[]
  tags: BlogTag[]
}

export interface BlogFilters {
  category?: string
  tag?: string
  search?: string
  featured?: boolean
}

export interface BlogListProps {
  posts: BlogPost[]
  categories: BlogCategory[]
  tags: BlogTag[]
  currentFilters: BlogFilters
  onFilterChange: (filters: BlogFilters) => void
}

export interface BlogPostProps {
  post: BlogPost
  relatedPosts?: BlogPost[]
}