import posthog from 'posthog-js'

let isInitialized = false

export function initPostHog() {
  if (typeof window !== 'undefined' && !isInitialized) {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY

    if (!key || key === 'phc_development_key') {
      console.warn('PostHog: No valid API key provided')
      return false
    }

    try {
      console.log('Initializing PostHog with key:', key)
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: process.env.NODE_ENV === 'development',
        cross_subdomain_cookie: false,
        secure_cookie: true,
        persistence: 'localStorage+cookie',
        autocapture: {
          dom_event_allowlist: ['click', 'submit', 'change'],
          url_allowlist: [window.location.origin]
        },
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
          }
          console.log('PostHog loaded successfully')
          isInitialized = true
        },
        on_xhr_error: (failedRequest) => {
          console.error('PostHog XHR error:', failedRequest)
        }
      })
      return true
    } catch (error) {
      console.error('PostHog initialization failed:', error)
      return false
    }
  }
  return isInitialized
}

// Track page views with error handling
export function trackPageView(url) {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      posthog.capture('$pageview', {
        $current_url: url || window.location.href,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('PostHog pageview tracking failed:', error)
    }
  }
}

// Track user interactions with enhanced properties
export function trackEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      posthog.capture(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        user_agent: navigator.userAgent
      })
    } catch (error) {
      console.error('PostHog event tracking failed:', error)
    }
  }
}

// Identify users with enhanced error handling
export function identifyUser(userId, properties = {}) {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      posthog.identify(userId, properties)
    } catch (error) {
      console.error('PostHog user identification failed:', error)
    }
  }
}

// Reset user session
export function resetUser() {
  if (typeof window !== 'undefined' && isInitialized) {
    try {
      posthog.reset()
    } catch (error) {
      console.error('PostHog reset failed:', error)
    }
  }
}

// Check if PostHog is ready
export function isPostHogReady() {
  return isInitialized && typeof window !== 'undefined'
}

export default posthog