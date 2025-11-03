'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import StatsPanel from './components/StatsPanel'

// Dynamically import map component (client-side only)
const RoadConditionsMap = dynamic(
  () => import('./components/RoadConditionsMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading map...</div>
      </div>
    )
  }
)

// API configuration - use Vercel proxy route to avoid mixed content
const API_URL = ''  // Use Vercel's API route (proxies to VPS)
const REFRESH_INTERVAL = 60000 // 60 seconds

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

interface CameraData {
  [key: string]: {
    camera: {
      display_name: string
      latitude: number
      longitude: number
      image_url?: string
    }
    status: string
    classification?: {
      condition: string
      confidence: number
      safety_level: 'safe' | 'caution' | 'hazardous' | 'unknown'
      timestamp: string
    }
  }
}

interface ApiResponse {
  data: CameraData
  stats: {
    total: number
    safe: number
    caution: number
    hazardous: number
    failed: number
  }
  last_updated: string
  timestamp: string
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)

  // Use SWR for automatic refresh and caching
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `${API_URL}/api/conditions`,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      onSuccess: () => setIsConnected(true),
      onError: () => setIsConnected(false)
    }
  )

  // Format timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Connection Error</h1>
          <p className="text-white mb-2">Could not connect to VPS API server</p>
          <p className="text-gray-400 text-sm">
            Check that the VPS is running and accessible
          </p>
          <p className="text-gray-500 text-xs mt-4">
            Error: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Loading data...</div>
          <div className="text-gray-400 text-sm">Fetching road conditions from VPS...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gray-900/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              UDOT Road Conditions
            </h1>
            <p className="text-sm text-gray-400">
              Last updated: {formatTimestamp(data.last_updated)}
            </p>
          </div>

          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <StatsPanel stats={data.stats} />

      {/* Map */}
      <div className="h-full w-full pt-[72px]">
        <RoadConditionsMap data={data.data} />
      </div>
    </main>
  )
}
