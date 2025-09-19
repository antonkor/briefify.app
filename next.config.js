/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 13+
  experimental: {
    // Ensure compatibility with Vercel
  },
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.posthog.com https://us-assets.i.posthog.com https://*.posthog.com; connect-src 'self' https://app.posthog.com https://us-assets.i.posthog.com https://*.posthog.com;"
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;