// components/map/RealMap3D.tsx
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationPoint } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Key, Eye, EyeOff, Trash2 } from "lucide-react";

/**
 * Props
 */
interface RealMapProps {
  selectedLocation: LocationPoint | null;
  onLocationSelect: (location: LocationPoint | null) => void;
  locations: LocationPoint[];
}

/** Quang Binh reference */
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

  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenPlain, setShowTokenPlain] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isCreating, setIsCreating] = useState(false); // tránh init 2 lần
  const [loadingText, setLoadingText] = useState("Loading terrain...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** Load token from localStorage on first mount */
  useEffect(() => {
    const saved = localStorage.getItem("mapbox_token");
    if (saved) {
      setMapboxToken(saved);
    }
  }, []);

  /** Initialize map when token exists */
  useEffect(() => {
    if (!mapboxToken || isCreating || map.current || !mapContainer.current) return;
    setErrorMsg(null);
    setIsCreating(true);

    try {
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

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("style.load", () => {
        if (!map.current) return;
        setLoadingText("Applying 3D terrain...");

        if (!map.current.getSource("mapbox-dem")) {
          map.current.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          } as any);
        }

        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 2 });

        map.current.setFog({
          color: "rgb(220,159,159)",
            "high-color": "rgb(36,92,223)",
            "horizon-blend": 0.02,
            "space-color": "rgb(11,11,25)",
            "star-intensity": 0.6,
        });

        map.current.dragRotate.enable();
        map.current.touchZoomRotate.enableRotation();
        map.current.setMaxPitch(85);
        setIsMapReady(true);
        setLoadingText("Rendering markers...");
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e.error);
        setErrorMsg("Mapbox style/resource error. Check token & network.");
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to initialize map. Invalid token?");
    } finally {
      setIsCreating(false);
    }

    return () => {
      // Clean up handled in separate effect (unmount)
    };
  }, [mapboxToken, isCreating]);

  /** Clean up on unmount */
  useEffect(
    () => () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    },
    []
  );

  /** Render markers each time dependencies change */
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // remove previous
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((location) => {
      const [lng, lat] = location.coordinates;

      // wrapper container
      const wrapper = document.createElement("div");
      wrapper.className = "custom-marker-wrapper";

      // marker bubble
      const inner = document.createElement("div");
      inner.style.cssText = `
        width:30px;height:30px;border-radius:50%;
        background:${location.type === "attraction" ? "#3b82f6" : "#f59e0b"};
        border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.3);
        display:flex;align-items:center;justify-content:center;
        font-size:12px;color:#fff;cursor:pointer;
        animation:pulse 2s infinite;transition:transform .3s;
        transform:${
          selectedLocation?.id === location.id ? "scale(1.3)" : "scale(1)"
        };
      `;
      inner.textContent = location.type === "attraction" ? "🏞️" : "🏺";

      wrapper.appendChild(inner);

      const marker = new mapboxgl.Marker(wrapper).setLngLat([lng, lat]).addTo(map.current!);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
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
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 12,
          pitch: 70,
          duration: 1500,
        });
      });

      // Touch toggle popup
      let touchOpen = false;
      inner.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        if (!touchOpen) {
          popup.setLngLat([lng, lat]).addTo(map.current!);
          touchOpen = true;
          if (selectedLocation?.id !== location.id)
            inner.style.transform = "scale(1.15)";
        } else {
          popup.remove();
          touchOpen = false;
          inner.style.transform =
            selectedLocation?.id === location.id ? "scale(1.3)" : "scale(1)";
        }
      });

      document.addEventListener(
        "touchstart",
        (ev) => {
          if (!wrapper.contains(ev.target as Node) && touchOpen) {
            popup.remove();
            touchOpen = false;
            inner.style.transform =
              selectedLocation?.id === location.id ? "scale(1.3)" : "scale(1)";
          }
        },
        { passive: true }
      );

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

    setLoadingText(""); // done
  }, [isMapReady, locations, selectedLocation, onLocationSelect]);

  /**
   * Save token
   */
  const handleSaveToken = () => {
    if (!mapboxToken.trim()) {
      setErrorMsg("Token is empty.");
      return;
    }
    localStorage.setItem("mapbox_token", mapboxToken.trim());
    setErrorMsg(null);
    // Force re-init if previously had an invalid token & no map
    if (!map.current) {
      setTimeout(() => {
        // Trigger init effect
        setMapboxToken((t) => t);
      }, 0);
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem("mapbox_token");
    setMapboxToken("");
    setIsMapReady(false);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  /** UI: Token input screen (when no token) */
  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center text-primary">
              <MapPin className="w-6 h-6" />
              Mapbox 3D Terrain Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
              <p>
                🗺️ Enter a <strong>Mapbox public token</strong> to load the
                Quang Binh 3D satellite terrain.
              </p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>
                  Visit{" "}
                  <a
                    href="https://mapbox.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    mapbox.com
                  </a>
                </li>
                <li>Create / Login & copy your *public* token</li>
                <li>Paste below & save</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Input
                type={showTokenPlain ? "text" : "password"}
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1IjoieW91ci11c2VyIi..."
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowTokenPlain((v) => !v)}
              >
                {showTokenPlain ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-500 bg-red-100/60 rounded p-2">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleSaveToken}>
                <Key className="w-4 h-4 mr-2" />
                Load 3D Map
              </Button>
              {!!localStorage.getItem("mapbox_token") && (
                <Button variant="outline" onClick={handleClearToken}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2">
              Token is stored locally (localStorage). Never commit it directly
              for production apps.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{ minHeight: 400 }}
      />

      {/* Loading overlay */}
      {(!isMapReady || loadingText) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10 pointer-events-none">
          <div className="text-center text-primary space-y-3">
            <div className="animate-spin w-9 h-9 border-4 border-primary/60 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm font-medium">
              {loadingText || "Initializing map..."}
            </p>
          </div>
        </div>
      )}

      {/* (Optional) Re-enter token button (small) */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleClearToken();
          }}
        >
          Reset Token
        </Button>
      </div>
    </div>
  );
};
