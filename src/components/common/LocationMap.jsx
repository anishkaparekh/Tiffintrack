import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function LocationMap({ latitude, longitude, title, onMapClick }) {
  console.log('LocationMap props', latitude, longitude);
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && latitude !== 0 && longitude !== 0;
  const position = hasCoords ? [latitude, longitude] : [22.3072, 70.8022]; // Default to Rajkot center

  return (
    <MapContainer
      key={hasCoords ? `${latitude}-${longitude}` : 'default'}
      center={position}
      zoom={hasCoords ? 15 : 13}
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <MapEvents onMapClick={onMapClick} />
      {hasCoords && (
        <Marker position={position}>
          <Popup>{title || 'Location'}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
