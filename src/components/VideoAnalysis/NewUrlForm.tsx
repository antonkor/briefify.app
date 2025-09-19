'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/posthog'

interface NewUrlFormProps {
  onAnalyze: (url: string) => Promise<void>
  onClose: () => void
  isVisible: boolean
}

export function NewUrlForm({ onAnalyze, onClose, isVisible }: NewUrlFormProps) {
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = async () => {
    if (!newUrl.trim()) return

    // Track new URL analysis
    trackEvent('video_analysis_started', {
      url: newUrl,
      source: 'new_url_form'
    })

    await onAnalyze(newUrl.trim())
    setNewUrl('')
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  if (!isVisible) return null

  return (
    <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <label
          htmlFor="new-youtube-url"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          New YouTube URL
        </label>
        <input
          id="new-youtube-url"
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm font-mono"
          onKeyPress={handleKeyPress}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={!newUrl.trim()}
            className="flex-1 bg-gradient-to-br from-slate-700/90 via-slate-800/95 to-slate-900/90 hover:from-slate-600/95 hover:via-slate-700/98 hover:to-slate-800/95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/40 text-white font-medium py-2 px-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-slate-900/60 relative overflow-hidden group"
          >
            <span className="relative z-10">Analyze New Video</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}