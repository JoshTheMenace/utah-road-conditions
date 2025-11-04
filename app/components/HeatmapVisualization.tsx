'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

interface CameraPoint {
  lat: number
  lon: number
  safety_level: string
  confidence: number
}

interface HeatmapVisualizationProps {
  cameras: CameraPoint[]
  visible: boolean
}

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
  function heatLayer(
    latlngs: [number, number, number][],
    options?: {
      minOpacity?: number
      maxZoom?: number
      max?: number
      radius?: number
      blur?: number
      gradient?: { [key: number]: string }
    }
  ): any
}

export default function HeatmapVisualization({ cameras, visible }: HeatmapVisualizationProps) {
  const map = useMap()

  useEffect(() => {
    if (!visible) return

    // Separate by safety level
    const hazardousPoints: [number, number, number][] = []
    const cautionPoints: [number, number, number][] = []
    const safePoints: [number, number, number][] = []

    cameras.forEach((cam) => {
      const intensity = cam.confidence * 1.5 // Boost intensity

      if (cam.safety_level === 'hazardous') {
        hazardousPoints.push([cam.lat, cam.lon, intensity])
      } else if (cam.safety_level === 'caution') {
        cautionPoints.push([cam.lat, cam.lon, intensity])
      } else if (cam.safety_level === 'safe') {
        safePoints.push([cam.lat, cam.lon, intensity * 0.5]) // Lower intensity for safe
      }
    })

    // Create heatmap layers
    const hazardLayer = L.heatLayer(hazardousPoints, {
      minOpacity: 0.3,
      maxZoom: 13,
      radius: 35,
      blur: 45,
      gradient: {
        0.0: 'rgba(255, 255, 0, 0)',
        0.5: 'rgba(255, 100, 0, 0.6)',
        1.0: 'rgba(255, 0, 0, 0.9)',
      },
    }).addTo(map)

    const cautionLayer = L.heatLayer(cautionPoints, {
      minOpacity: 0.2,
      maxZoom: 13,
      radius: 30,
      blur: 40,
      gradient: {
        0.0: 'rgba(255, 255, 0, 0)',
        0.5: 'rgba(255, 200, 0, 0.4)',
        1.0: 'rgba(255, 165, 0, 0.7)',
      },
    }).addTo(map)

    const safeLayer = L.heatLayer(safePoints, {
      minOpacity: 0.15,
      maxZoom: 13,
      radius: 25,
      blur: 35,
      gradient: {
        0.0: 'rgba(0, 255, 0, 0)',
        0.5: 'rgba(0, 255, 100, 0.2)',
        1.0: 'rgba(0, 255, 0, 0.4)',
      },
    }).addTo(map)

    // Cleanup
    return () => {
      map.removeLayer(hazardLayer)
      map.removeLayer(cautionLayer)
      map.removeLayer(safeLayer)
    }
  }, [map, cameras, visible])

  return null
}
