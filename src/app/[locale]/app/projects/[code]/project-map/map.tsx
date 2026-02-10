'use client'

import { Tables } from '@/lib/supabase/types/database.types'

import 'leaflet/dist/leaflet.css'

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import 'leaflet-defaulticon-compatibility'

export default function Map({
  project,
  translations,
}: {
  project: Tables<'project'>
  translations: Tables<'project_translation'>
}) {
  return (
    <MapContainer
      attributionControl={false}
      center={[project.lat, project.lng]}
      className="z-0 h-[400px] w-full"
      scrollWheelZoom={false}
      zoom={7}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* https://github.com/PaulLeCam/react-leaflet/issues/808#issuecomment-747719927 */}
      <Marker position={[project.lat, project.lng]}>
        <Popup>
          {translations.city}, {translations.state}, {translations.country}
        </Popup>
      </Marker>
    </MapContainer>
  )
}
