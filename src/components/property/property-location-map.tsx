"use client";

import { GoogleMap, useJsApiLoader, Marker, Circle } from "@react-google-maps/api";
import { env } from "~/env";

interface PropertyLocationMapProps {
  lat: number;
  lng: number;
  locationVisibility: number | null; // 1=Exact, 2=Street, 3=Zone
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

type VisibilityConfig = {
  zoom: number;
  showMarker: boolean;
  showCircle: boolean;
  radius?: number;
};

const visibilityConfigs: Record<number, VisibilityConfig> = {
  1: { zoom: 17, showMarker: true, showCircle: false }, // Exact
  2: { zoom: 15, showMarker: true, showCircle: false }, // Street
  3: { zoom: 14, showMarker: false, showCircle: true, radius: 300 }, // Zone
};

const defaultConfig: VisibilityConfig = {
  zoom: 17,
  showMarker: true,
  showCircle: false,
};

export function PropertyLocationMap({
  lat,
  lng,
  locationVisibility,
}: PropertyLocationMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const visibility = locationVisibility ?? 1;
  const config = visibilityConfigs[visibility] ?? defaultConfig;
  const center = { lat, lng };

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Error al cargar el mapa</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      mapContainerClassName="rounded-lg"
      center={center}
      zoom={config.zoom}
      options={{
        disableDefaultUI: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {config.showMarker && <Marker position={center} />}
      {config.showCircle && config.radius && (
        <Circle
          center={center}
          radius={config.radius}
          options={{
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            strokeColor: "#3b82f6",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
}
