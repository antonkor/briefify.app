import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Briefify',
  description: 'Brief insights on your interests. AI-powered YouTube summaries made simple.',
  keywords: 'YouTube, AI, summaries, insights, video analysis, brief, artificial intelligence',
  authors: [{ name: 'Briefify' }],
  creator: 'Briefify',
  publisher: 'Briefify',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://briefify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Briefify',
    description: 'Brief insights on your interests. AI-powered YouTube summaries made simple.',
    url: 'https://briefify.app',
    siteName: 'Briefify',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Briefify',
    description: 'Brief insights on your interests. AI-powered YouTube summaries made simple.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QHSSV53QFS"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QHSSV53QFS');
            `,
          }}
        />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}