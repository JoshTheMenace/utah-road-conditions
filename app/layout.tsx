import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UDOT Road Conditions',
  description: 'Real-time Utah road conditions from traffic cameras',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
