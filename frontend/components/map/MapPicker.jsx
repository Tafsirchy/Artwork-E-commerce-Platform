"use client";

import dynamic from "next/dynamic";

// Since leaflet uses window, we must dynamically import it
const MapWithNoSSR = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

export default function MapPicker({ onLocationSelect }) {
  return <MapWithNoSSR onLocationSelect={onLocationSelect} />;
}
