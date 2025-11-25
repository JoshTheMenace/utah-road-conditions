import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Utah Road Conditions | Real-time AI-Powered Monitoring',
  description: 'Monitor real-time Utah road conditions with AI-powered snow and weather analysis from traffic cameras across the state.',
  keywords: ['Utah', 'road conditions', 'snow', 'weather', 'traffic', 'UDOT', 'real-time', 'AI'],
  authors: [{ name: 'Utah Road Conditions' }],
  openGraph: {
    title: 'Utah Road Conditions',
    description: 'Real-time AI-powered road condition monitoring for Utah',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark-950 text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  )
}
