'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'
import HeatmapVisualization from './HeatmapVisualization'

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

interface RoadConditionsMapProps {
  data: CameraData
  visualizationMode: 'markers' | 'heatmap'
}

const SAFETY_COLORS = {
  safe: '#22c55e',
  caution: '#f59e0b',
  hazardous: '#ef4444',
  unknown: '#64748b'
}

const SAFETY_GRADIENTS = {
  safe: 'from-emerald-500 to-green-600',
  caution: 'from-amber-500 to-orange-600',
  hazardous: 'from-rose-500 to-red-600',
  unknown: 'from-slate-500 to-gray-600'
}

const SAFETY_LABELS = {
  safe: 'Clear',
  caution: 'Caution',
  hazardous: 'Hazardous',
  unknown: 'Unknown'
}

export default function RoadConditionsMap({ data, visualizationMode }: RoadConditionsMapProps) {
  // Utah center coordinates
  const center: LatLngExpression = [39.3, -111.0]

  // Convert data to array for rendering
  const cameras = Object.entries(data).map(([id, camera]) => ({
    id,
    ...camera
  }))

  // Prepare camera points for visualizations
  const cameraPoints = cameras
    .filter((cam) => cam.camera.latitude && cam.camera.longitude && cam.classification)
    .map((cam) => ({
      lat: cam.camera.latitude,
      lon: cam.camera.longitude,
      safety_level: cam.classification?.safety_level || 'unknown',
      confidence: cam.classification?.confidence || 0,
      name: cam.camera.display_name,
    }))

  return (
    <>
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Individual Markers Mode */}
        {visualizationMode === 'markers' && cameras.map((camera) => {
          if (!camera.camera.latitude || !camera.camera.longitude) {
            return null
          }

          const safetyLevel = camera.classification?.safety_level || 'unknown'
          const color = SAFETY_COLORS[safetyLevel]

          return (
            <CircleMarker
              key={camera.id}
              center={[camera.camera.latitude, camera.camera.longitude]}
              radius={8}
              pathOptions={{
                color: 'rgba(255, 255, 255, 0.8)',
                fillColor: color,
                fillOpacity: 0.9,
                weight: 2
              }}
            >
              <Popup maxWidth={320} minWidth={280}>
                <div className="p-0 -m-[14px] -mb-[14px]">
                  {/* Header with gradient */}
                  <div className={`
                    bg-gradient-to-r ${SAFETY_GRADIENTS[safetyLevel]}
                    px-4 py-3
                  `}>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                        {SAFETY_LABELS[safetyLevel]}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-2 leading-tight">
                      {camera.camera.display_name}
                    </h4>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {camera.classification ? (
                      <>
                        {/* Condition Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Condition</span>
                            <span className="text-xs text-white font-semibold">
                              {camera.classification.condition}
                            </span>
                          </div>

                          {/* Confidence Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-400 font-medium">Confidence</span>
                              <span className="text-xs text-white font-semibold tabular-nums">
                                {(camera.classification.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${SAFETY_GRADIENTS[safetyLevel]}`}
                                style={{ width: `${camera.classification.confidence * 100}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium">Detected</span>
                            <span className="text-xs text-slate-300">
                              {new Date(camera.classification.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {/* View Camera Button */}
                        {camera.camera.image_url && (
                          <a
                            href={camera.camera.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              flex items-center justify-center gap-2
                              w-full py-2 px-3
                              bg-gradient-to-r from-blue-500/20 to-violet-500/20
                              hover:from-blue-500/30 hover:to-violet-500/30
                              border border-blue-500/30
                              rounded-lg
                              text-xs font-semibold text-blue-300
                              transition-all duration-300
                              group
                            "
                          >
                            <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Live Camera
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs">No classification data available</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {/* Heatmap Mode */}
        <HeatmapVisualization
          cameras={cameraPoints}
          visible={visualizationMode === 'heatmap'}
        />
      </MapContainer>
    </>
  )
}
