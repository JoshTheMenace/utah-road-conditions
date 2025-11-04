import { NextResponse } from 'next/server'

// This runs on Vercel's server (not in browser), so HTTP is OK
// Server-side env var (doesn't need NEXT_PUBLIC_ prefix)
const API_URL = process.env.API_URL || 'http://localhost:5000'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/conditions`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 60 seconds
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Backend API responded with ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch road conditions data' },
      { status: 500 }
    )
  }
}
