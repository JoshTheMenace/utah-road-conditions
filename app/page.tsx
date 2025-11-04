'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import StatsPanel from './components/StatsPanel'
import Header from './components/Header'
import Footer from './components/Footer'
import FilterPanel, { FilterState } from './components/FilterPanel'

// Dynamically import map component (client-side only)
const RoadConditionsMap = dynamic(
  () => import('./components/RoadConditionsMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading map...</div>
          <div className="text-blue-200 text-sm mt-2">Preparing road conditions data</div>
        </div>
      </div>
    )
  }
)

// API configuration - use Vercel proxy route to avoid mixed content
const API_URL = ''  // Use Vercel's API route
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
  const [searchTerm, setSearchTerm] = useState('')
  const [visualizationMode, setVisualizationMode] = useState<'markers' | 'heatmap'>('heatmap')
  const [filters, setFilters] = useState<FilterState>({
    showSafe: true,
    showCaution: true,
    showHazardous: true,
    showFailed: true,
  })

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

  // Format relative time (e.g., "2 minutes ago")
  const getRelativeTime = (timestamp?: string) => {
    if (!timestamp) return 'never'
    const now = new Date().getTime()
    const then = new Date(timestamp).getTime()
    const diff = now - then
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`

    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    if (hours < 24) return `${hours} hours ago`

    const days = Math.floor(hours / 24)
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  // Filter camera data based on search term and filters
  const getFilteredData = () => {
    if (!data || !data.data) return null

    const filteredData: CameraData = {}

    Object.entries(data.data).forEach(([key, camera]) => {
      const safetyLevel = camera.classification?.safety_level || 'unknown'
      const status = camera.status
      const name = camera.camera.display_name.toLowerCase()
      const searchLower = searchTerm.toLowerCase()

      // Check if camera matches search term
      const matchesSearch = !searchTerm || name.includes(searchLower)

      // Check if camera matches filter
      const matchesFilter = (
        (filters.showSafe && safetyLevel === 'safe') ||
        (filters.showCaution && safetyLevel === 'caution') ||
        (filters.showHazardous && safetyLevel === 'hazardous') ||
        (filters.showFailed && status === 'failed')
      )

      if (matchesSearch && matchesFilter) {
        filteredData[key] = camera
      }
    })

    return filteredData
  }

  // Calculate filtered stats
  const getFilteredStats = () => {
    const filteredData = getFilteredData()
    if (!filteredData) return data?.stats || { total: 0, safe: 0, caution: 0, hazardous: 0, failed: 0 }

    const stats = {
      total: 0,
      safe: 0,
      caution: 0,
      hazardous: 0,
      failed: 0,
    }

    Object.values(filteredData).forEach((camera) => {
      stats.total++
      const safetyLevel = camera.classification?.safety_level || 'unknown'
      if (safetyLevel === 'safe') stats.safe++
      else if (safetyLevel === 'caution') stats.caution++
      else if (safetyLevel === 'hazardous') stats.hazardous++
      if (camera.status === 'failed') stats.failed++
    })

    return stats
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-red-500/20 shadow-2xl">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-400 mb-3">Connection Error</h1>
          <p className="text-white mb-2 font-semibold">Could not connect to server</p>
          <p className="text-blue-200 text-sm mb-4">
            The road conditions service is temporarily unavailable
          </p>
          <p className="text-gray-400 text-xs mb-6 font-mono bg-black/20 p-2 rounded">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !data || !data.data || !data.stats) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <div className="text-white text-2xl font-bold mb-2">Loading data...</div>
          <div className="text-blue-200 text-sm">Fetching real-time road conditions</div>
          <div className="mt-4 flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  // At this point, data, data.data, and data.stats are guaranteed to exist
  const filteredData = getFilteredData() || {}
  const filteredStats = getFilteredStats()

  return (
    <main className="relative h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <Header
        lastUpdated={getRelativeTime(data.last_updated)}
        isConnected={isConnected}
      />

      {/* Filter Panel */}
      <FilterPanel
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
        onVisualizationModeChange={setVisualizationMode}
        visualizationMode={visualizationMode}
      />

      {/* Stats Panel */}
      <StatsPanel stats={filteredStats} />

      {/* Map */}
      <div className="h-full w-full pt-[64px] pb-[48px]">
        <RoadConditionsMap data={filteredData} visualizationMode={visualizationMode} />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
