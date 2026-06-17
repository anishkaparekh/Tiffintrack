import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Ensure default icon URLs are set for Vite (ESM) without require()
// The icon images are imported as ES modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function LocationMap({ latitude, longitude, title }) {
  console.log('LocationMap props', latitude, longitude);
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number';
  const position = hasCoords ? [latitude, longitude] : [0, 0];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {hasCoords && (
        <Marker position={position}>
          <Popup>{title || 'Location'}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
