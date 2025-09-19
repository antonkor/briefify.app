import { useEffect } from 'react'
import { initPostHog, trackEvent, trackPageView } from '@/lib/posthog'

/**
 * Custom hook for handling PostHog analytics and session tracking
 * Initializes PostHog, tracks page views, and manages session lifecycle
 */
export const useAnalytics = () => {
  useEffect(() => {
    // Initialize PostHog
    initPostHog()
    trackPageView(window.location.href)

    // Track session start
    const sessionStart = Date.now()
    trackEvent('session_started', {
      timestamp: sessionStart,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`
    })

    // Track session duration on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.round((Date.now() - sessionStart) / 1000) // seconds
      trackEvent('session_ended', {
        duration_seconds: sessionDuration,
        duration_minutes: Math.round(sessionDuration / 60)
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Return tracking functions for use in components
  return {
    trackEvent,
    trackPageView
  }
}