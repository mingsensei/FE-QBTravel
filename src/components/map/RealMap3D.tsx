// RealMap3D.tsx (đã lược bỏ header card)
import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationPoint } from "@/types/map";

interface RealMapProps {
  selectedLocation: LocationPoint | null;
  onLocationSelect: (location: LocationPoint | null) => void;
  locations: LocationPoint[];
}

const QUANG_BINH_CENTER: [number, number] = [106.6, 17.5];
const QUANG_BINH_BOUNDS: [[number, number], [number, number]] = [
  [106.0, 17.0],
  [107.2, 18.0],
];

export const RealMap3D: React.FC<RealMapProps> = ({
  selectedLocation,
  onLocationSelect,
  locations,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const orbitReqRef = useRef<number | null>(null);
  const orbitActiveRef = useRef(false);
  const orbitCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mapbox_token");
    if (saved) setMapboxToken(saved);
    else setShowTokenInput(true);
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapboxToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: QUANG_BINH_CENTER,
      zoom: 9,
      pitch: 55,
      bearing: 0,
      antialias: true,
      dragRotate: true,
      pitchWithRotate: true,
      maxBounds: QUANG_BINH_BOUNDS,
      cooperativeGestures: false,
    });

    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enableRotation();
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("style.load", () => {
      if (!map.current) return;
      if (!map.current.getSource("mapbox-dem")) {
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512, maxzoom: 14,
        });
      }
      map.current.setTerrain({ source: "mapbox-dem", exaggeration: 2 });
      map.current.setFog({
        color: "rgb(220,159,159)",
        "high-color": "rgb(36,92,223)",
        "horizon-blend": 0.02,
        "space-color": "rgb(11,11,25)",
        "star-intensity": 0.6,
      });
      map.current.setMaxPitch(85);
      setIsMapReady(true);
    });

    return () => {
      if (orbitReqRef.current) cancelAnimationFrame(orbitReqRef.current);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setIsMapReady(false);
    };
  }, [mapboxToken]);

  // Orbit (giữ nguyên nếu cần – lược bỏ ở đây cho ngắn gọn)
  const stopOrbit = () => {
    orbitActiveRef.current = false;
    orbitCenterRef.current = null;
    if (orbitReqRef.current) cancelAnimationFrame(orbitReqRef.current);
    orbitReqRef.current = null;
  };

  useEffect(() => {
    if (!map.current || !isMapReady) return;
    // clear markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    locations.forEach(location => {
      const [lng, lat] = location.coordinates;
      const wrapper = document.createElement("div");
      const inner = document.createElement("div");
      inner.style.cssText = `
        width:30px;height:30px;border-radius:50%;
        background:${location.type === "attraction" ? "#3b82f6" : "#f59e0b"};
        border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.3);
        display:flex;align-items:center;justify-content:center;
        font-size:12px;color:#fff;cursor:pointer;
        animation:pulse 2s infinite;transition:transform .3s;
        transform:${selectedLocation?.id === location.id ? "scale(1.3)" : "scale(1)"};
      `;
      inner.textContent = location.type === "attraction" ? "🏞️" : "🏺";
      wrapper.appendChild(inner);

      const marker = new mapboxgl.Marker(wrapper).setLngLat([lng, lat]).addTo(map.current!);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding:8px;font-family:system-ui;">
            <h4 style="margin:0 0 4px;color:#333;">${location.name}</h4>
            <p style="margin:0;font-size:12px;color:#666;">${location.category}</p>
            <p style="margin:4px 0 0;font-size:11px;color:#999;">
              ⭐ ${location.rating} • ${location.checkIns.toLocaleString()} check-ins
            </p>
          </div>
        `);

      inner.addEventListener("mouseenter", () => {
        if (selectedLocation?.id !== location.id) inner.style.transform = "scale(1.15)";
        popup.setLngLat([lng, lat]).addTo(map.current!);
      });
      inner.addEventListener("mouseleave", () => {
        popup.remove();
        inner.style.transform =
          selectedLocation?.id === location.id ? "scale(1.3)" : "scale(1)";
      });

      inner.addEventListener("click", () => {
        onLocationSelect(location);
        stopOrbit();
        map.current?.flyTo({
          center: [lng, lat], zoom: 12, pitch: 70, duration: 1500,
        });
      });

      markersRef.current.push(marker);
    });

    if (!document.getElementById("marker-styles")) {
      const style = document.createElement("style");
      style.id = "marker-styles";
      style.textContent = `
        @keyframes pulse {
          0%{transform:scale(1)}
          50%{transform:scale(1.1)}
          100%{transform:scale(1)}
        }
      `;
      document.head.appendChild(style);
    }
  }, [isMapReady, locations, selectedLocation, onLocationSelect]);

  if (showTokenInput || !mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        {/* (Giữ nguyên form token như cũ nếu bạn cần – lược bớt ở đây) */}
        <div className="text-sm text-center">Enter Mapbox token…</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
          <div className="text-primary">Loading map…</div>
        </div>
      )}
    </div>
  );
};
