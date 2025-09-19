'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/posthog'

interface VideoInputFormProps {
  onAnalyze: (url: string) => Promise<void>
  isLoading: boolean
  initialUrl?: string
}

export function VideoInputForm({
  onAnalyze,
  isLoading,
  initialUrl = "https://www.youtube.com/watch?v=8s6nGMcyr7k"
}: VideoInputFormProps) {
  const [url, setUrl] = useState(initialUrl)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || isLoading) return

    // Track analysis start
    trackEvent('video_analysis_started', {
      url: url,
      source: 'main_form'
    })

    await onAnalyze(url.trim())
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="youtube-url"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          YouTube Video URL
        </label>
        <div className="relative">
          <input
            id="youtube-url"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://www.youtube.com/watch?v=8s6nGMcyr7k"
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-mono transition-all duration-500 ${
              isLoading ? 'opacity-20 pointer-events-none' : 'opacity-100'
            }`}
            disabled={isLoading}
            required
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Video'}
      </button>
    </form>
  )
}