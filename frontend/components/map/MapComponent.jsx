"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom gold icon
const goldIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #C8A96A; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #1c1c1c; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={goldIcon}></Marker>
  );
}

export default function MapComponent({ onLocationSelect }) {
  const [position, setPosition] = useState({ lat: 23.8103, lng: 90.4125 });

  const handleSetPosition = (pos) => {
    setPosition(pos);
    if (onLocationSelect) {
      onLocationSelect(pos);
    }
  };

  useEffect(() => {
    onLocationSelect(position);
  }, []);

  return (
    <div className="h-64 w-full relative z-0 border border-gallery-border shadow-inner group overflow-hidden">
      <div className="absolute inset-0 bg-gallery-gold/5 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", filter: "brightness(1.02) contrast(1.02) saturate(1.1)" }}
        className="transition-all duration-700"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
    </div>
  );
}
