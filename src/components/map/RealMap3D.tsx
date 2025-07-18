import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LocationPoint } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Key, Eye, EyeOff } from 'lucide-react';
import {createThreeLayer} from "@/components/map/ThreeCustomLayer.ts";
interface RealMapProps {
  selectedLocation: LocationPoint | null;
  onLocationSelect: (location: LocationPoint | null) => void;
  locations: LocationPoint[];
}

// Quang Binh province coordinates
const QUANG_BINH_CENTER: [number, number] = [106.6, 17.5];
const QUANG_BINH_BOUNDS: [[number, number], [number, number]] = [
  [106.0, 17.0], // Southwest
  [107.2, 18.0]  // Northeast
];

export const RealMap3D: React.FC<RealMapProps> = ({
  selectedLocation,
  onLocationSelect,
  locations
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    console.log('Initializing Mapbox map for Quang Binh province');

    // Set access token
    mapboxgl.accessToken = mapboxToken;

    // Create map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite imagery
      center: QUANG_BINH_CENTER,
      zoom: 9,
      pitch: 60, // 3D angle
      bearing: 0,
      maxBounds: QUANG_BINH_BOUNDS,
      antialias: true,
      dragRotate: true
    });

    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enableRotation();

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({
      visualizePitch: true
    }), 'top-right');

    // Enable 3D terrain
    map.current.on('style.load', () => {
      if (!map.current) return;

      console.log('Map style loaded, adding 3D terrain');

      // Add terrain source
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });

      // Set terrain
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 2 });

      // Add atmosphere for beautiful sky
      map.current.setFog({
        color: 'rgb(220, 159, 159)', // Pinkish sky
        'high-color': 'rgb(36, 92, 223)', // Blue atmosphere
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      });

      setIsMapReady(true);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setIsMapReady(false);
      }
    };
  }, [mapboxToken]);

  // Add location markers when map is ready
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    console.log('Adding location markers to map');

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for each location
    locations.forEach((location) => {
      // Use real coordinates
      const [lng, lat] = location.coordinates;

      // Create marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${location.type === 'attraction' ? '#3b82f6' : '#f59e0b'};
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        animation: pulse 2s infinite;
        transform: scale(${selectedLocation?.id === location.id ? '1.3' : '1'});
        transition: transform 0.3s ease;
      `;
      markerEl.innerHTML = location.type === 'attraction' ? '🏞️' : '🏺';

      // Create marker
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      // Add click handler
      markerEl.addEventListener('click', () => {
        console.log('Marker clicked:', location.name);
        onLocationSelect(location);
        
        // Fly to location
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 12,
          pitch: 70,
          duration: 2000
        });
      });

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false
      }).setHTML(`
        <div style="padding: 8px; font-family: system-ui;">
          <h4 style="margin: 0 0 4px 0; color: #333;">${location.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #666;">${location.category}</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #999;">⭐ ${location.rating} • ${location.checkIns.toLocaleString()} check-ins</p>
        </div>
      `);

      markerEl.addEventListener('mouseenter', () => {
        popup.setLngLat([lng, lat]).addTo(map.current!);
      });

      markerEl.addEventListener('mouseleave', () => {
        popup.remove();
      });

      markersRef.current.push(marker);
    });

    // Add CSS for pulse animation
    if (!document.getElementById('marker-styles')) {
      const style = document.createElement('style');
      style.id = 'marker-styles';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
          50% { transform: scale(1.1); box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
          100% { transform: scale(1); box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        }
      `;
      document.head.appendChild(style);
    }
  }, [isMapReady, locations, selectedLocation, onLocationSelect]);

  const handleTokenSave = () => {
    if (!mapboxToken.trim()) return;
    
    localStorage.setItem('mapbox_token', mapboxToken);
    setShowTokenInput(false);
    console.log('Mapbox token saved to localStorage');
  };

  const clearToken = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setShowTokenInput(true);
    if (map.current) {
      map.current.remove();
      map.current = null;
      setIsMapReady(false);
    }
  };

  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on("style.load", () => {
      if (!mapRef.current.getLayer('threejs-layer')) {
        mapRef.current.addLayer(createThreeLayer(locations)); // locations là mảng data bạn đã có
      }
    });
  }, [locations]);

  if (showTokenInput || !mapboxToken) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        <Card className="w-full max-w-md shadow-floating">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center text-primary">
              <MapPin className="w-6 h-6" />
              Mapbox 3D Terrain Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>🗺️ To show realistic 3D terrain of Quang Binh province, we need a Mapbox API key.</p>
              <p>📍 Get your <strong>free</strong> Mapbox token:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a></li>
                <li>Create a free account</li>
                <li>Copy your public token from the dashboard</li>
              </ol>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type={showTokenInput ? "text" : "password"}
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                >
                  {showTokenInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleTokenSave} className="flex-1">
                  <Key className="w-4 h-4 mr-2" />
                  Load 3D Map
                </Button>
                {localStorage.getItem('mapbox_token') && (
                  <Button variant="outline" onClick={clearToken}>
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p><strong>💡 Tip:</strong> Your token is stored locally in your browser. For production apps, use Supabase for secure secret management.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center text-primary">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading Quang Binh 3D Terrain...</p>
          </div>
        </div>
      )}

      {isMapReady && (
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-nature">
          <h3 className="text-sm font-semibold text-primary mb-1">🏔️ Quang Binh Province</h3>
          <p className="text-xs text-muted-foreground">Real 3D terrain • {locations.length} locations</p>
        </div>
      )}
    </div>
  );
};