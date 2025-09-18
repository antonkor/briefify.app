import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_development_key', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      // Disable in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: false // We'll capture manually
    })
  }
}

// Track page views
export function trackPageView(url) {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', {
      $current_url: url
    })
  }
}

// Track user interactions
export function trackEvent(eventName, properties = {}) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

export default posthog