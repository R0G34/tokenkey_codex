'use client'

import 'leaflet/dist/leaflet.css'

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'

import { MapContainer, Marker, TileLayer } from 'react-leaflet'

import 'leaflet-defaulticon-compatibility'

export default function Map() {
  return (
    <MapContainer
      attributionControl={false}
      center={[40.4206852977369, -3.708522902665756]}
      className="z-0 size-full"
      scrollWheelZoom={false}
      zoom={12}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* https://github.com/PaulLeCam/react-leaflet/issues/808#issuecomment-747719927 */}
      <Marker position={[40.4206852977369, -3.708522902665756]} />
    </MapContainer>
  )
}
