'use client'

import { useState } from 'react'
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
      <div className="h-screen w-full flex items-center justify-center bg-dark-950 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative text-center z-10">
          {/* Elegant spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-violet-500 rounded-full animate-pulse" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Loading Map</h2>
          <p className="text-slate-400 text-sm">Preparing visualization...</p>
        </div>
      </div>
    )
  }
)

// API configuration
const API_URL = ''
const REFRESH_INTERVAL = 60000

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

  const getFilteredData = () => {
    if (!data || !data.data) return null

    const filteredData: CameraData = {}

    Object.entries(data.data).forEach(([key, camera]) => {
      const safetyLevel = camera.classification?.safety_level || 'unknown'
      const status = camera.status
      const name = camera.camera.display_name.toLowerCase()
      const searchLower = searchTerm.toLowerCase()

      const matchesSearch = !searchTerm || name.includes(searchLower)
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

  // Error State
  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-md w-full mx-4">
          <div className="
            bg-dark-900/80 backdrop-blur-2xl
            border border-red-500/20
            rounded-3xl
            p-8
            shadow-[0_20px_60px_rgba(239,68,68,0.15)]
            animate-fadeInUp
          ">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Connection Error</h1>
              <p className="text-slate-400 mb-4">Unable to reach the road conditions service</p>
              <div className="inline-block px-4 py-2 bg-dark-800/80 rounded-xl border border-white/5">
                <code className="text-xs text-red-400 font-mono">{error.message}</code>
              </div>
            </div>

            {/* Retry Button */}
            <button
              onClick={() => window.location.reload()}
              className="
                w-full py-3 px-6
                bg-gradient-to-r from-blue-500 to-violet-600
                hover:from-blue-400 hover:to-violet-500
                rounded-xl
                font-semibold text-white
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]
                hover:-translate-y-0.5
                active:translate-y-0
                flex items-center justify-center gap-2
                group
              "
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loading State
  if (isLoading || !data || !data.data || !data.stats) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-950 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative text-center z-10 animate-fadeInUp">
          {/* Elegant loading animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500/50 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-cyan-500/50 animate-spin" style={{ animationDuration: '1.5s' }} />

            {/* Center glow */}
            <div className="absolute inset-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-violet-500 to-cyan-500 rounded-full shadow-lg animate-pulse" />
            </div>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-white mb-3">Loading Road Conditions</h2>
          <p className="text-slate-400 mb-6">Fetching real-time camera data across Utah...</p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  const filteredData = getFilteredData() || {}
  const filteredStats = getFilteredStats()

  return (
    <main className="relative h-screen w-full bg-dark-950 overflow-hidden">
      {/* Subtle background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />

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
      <div className="h-full w-full pt-[72px] pb-[56px]">
        <RoadConditionsMap data={filteredData} visualizationMode={visualizationMode} />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
