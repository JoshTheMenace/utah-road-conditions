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
  safe: '#00FF00',
  caution: '#FFA500',
  hazardous: '#FF0000',
  unknown: '#808080'
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
              radius={6}
              pathOptions={{
                color: 'white',
                fillColor: color,
                fillOpacity: 0.9,
                weight: 2
              }}
            >
              <Popup maxWidth={350}>
                <div className="p-2">
                  <h4 className="font-bold text-sm mb-2">
                    {camera.camera.display_name}
                  </h4>

                  {camera.classification && (
                    <>
                      <div
                        className="text-white font-bold text-center py-2 px-3 rounded mb-2"
                        style={{ backgroundColor: color }}
                      >
                        {safetyLevel.toUpperCase()}
                      </div>

                      <div className="text-xs space-y-1">
                        <div>
                          <strong>Condition:</strong> {camera.classification.condition}
                        </div>
                        <div>
                          <strong>Confidence:</strong>{' '}
                          {(camera.classification.confidence * 100).toFixed(1)}%
                        </div>
                        <div>
                          <strong>Detected:</strong>{' '}
                          {new Date(camera.classification.timestamp).toLocaleString()}
                        </div>
                      </div>

                      {camera.camera.image_url && (
                        <a
                          href={camera.camera.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-2 text-xs text-blue-600 hover:underline"
                        >
                          View Live Camera →
                        </a>
                      )}
                    </>
                  )}

                  {!camera.classification && (
                    <div className="text-xs text-gray-500">
                      No classification data available
                    </div>
                  )}
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
