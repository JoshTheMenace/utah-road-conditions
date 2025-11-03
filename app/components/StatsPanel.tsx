'use client'

interface Stats {
  total: number
  safe: number
  caution: number
  hazardous: number
  failed: number
}

interface StatsPanelProps {
  stats: Stats
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="absolute top-[88px] right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 min-w-[250px]">
      <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-800 pb-2 mb-3">
        📊 Road Conditions
      </h3>

      <div className="space-y-2">
        {/* Safe */}
        <div className="flex justify-between items-center bg-green-50 p-2 rounded">
          <span className="flex items-center gap-2">
            <span className="text-xl">🟢</span>
            <span className="font-medium text-gray-700">Safe</span>
          </span>
          <strong className="text-lg text-gray-900">{stats.safe}</strong>
        </div>

        {/* Caution */}
        <div className="flex justify-between items-center bg-yellow-50 p-2 rounded">
          <span className="flex items-center gap-2">
            <span className="text-xl">🟡</span>
            <span className="font-medium text-gray-700">Caution</span>
          </span>
          <strong className="text-lg text-gray-900">{stats.caution}</strong>
        </div>

        {/* Hazardous */}
        <div className="flex justify-between items-center bg-red-50 p-2 rounded">
          <span className="flex items-center gap-2">
            <span className="text-xl">🔴</span>
            <span className="font-medium text-gray-700">Hazardous</span>
          </span>
          <strong className="text-lg text-gray-900">{stats.hazardous}</strong>
        </div>

        {/* Failed */}
        {stats.failed > 0 && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-medium text-gray-700">Failed</span>
            </span>
            <strong className="text-lg text-gray-900">{stats.failed}</strong>
          </div>
        )}
      </div>

      <hr className="my-3" />

      <div className="text-xs text-gray-600 text-center">
        Total: {stats.total} cameras
      </div>
    </div>
  )
}
