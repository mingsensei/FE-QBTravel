import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../Map.css'; // file css chứa marker + popup
import { allLocations, famousPlaces, craftVillages } from '@/data/locations';
import { LocationPoint } from '@/types/map';
import { LocationPanel } from '@/components/ui/location-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Users, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationPoint | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExplorationOpen, setIsExplorationOpen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  const createMarkerElement = (location: LocationPoint) => {
    const el = document.createElement('div');
    el.className = `custom-marker ${location.type}`;
    el.innerHTML = `
      <div class="marker-inner">
        <div class="marker-icon">
          ${location.type === 'attraction' ? '🏞️' : '🏺'}
        </div>
      </div>
      <div class="marker-pulse"></div>
    `;
    return el;
  };

  const createPopupContent = (location: LocationPoint) => {
    return `
      <div class="custom-popup-content">
        <div class="popup-header">
          <h3 class="popup-title">${location.name}</h3>
          <span class="popup-category">${location.category}</span>
        </div>
        <div class="popup-body">
          <p class="popup-description">${location.description}</p>
          <div class="popup-stats">
            <span class="popup-rating">⭐ ${location.rating}</span>
            <span class="popup-checkins">👥 ${location.checkIns.toLocaleString()}</span>
          </div>
          <div class="popup-highlights">
            ${location.highlights.map(highlight => `<span class="highlight-tag">${highlight}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    const saved = localStorage.getItem("mapbox_token");
    if (saved) {
      setMapboxToken(saved);
    } else {
      setShowTokenInput(true);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    console.log('MapPage: Initializing map with', allLocations.length, 'locations');

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: [106.4, 17.5],
      zoom: 9,
    });

    map.on('load', () => {
      console.log('MapPage: Map loaded, adding markers');
      
      allLocations.forEach((location: LocationPoint, index) => {
        console.log(`Adding marker ${index + 1}:`, location.name, location.coordinates);
        
        // Create custom marker element
        const markerEl = createMarkerElement(location);
        
        // Create marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(location.coordinates)
          .addTo(map);

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          className: `custom-popup ${location.type}-popup`,
        }).setHTML(createPopupContent(location));

        // Add click event to marker
        markerEl.addEventListener('click', () => {
          console.log('Marker clicked:', location.name);
          setSelectedLocation(location);
          setIsPanelOpen(true);
        });

        // Add hover effects
        markerEl.addEventListener('mouseenter', () => {
          markerEl.classList.add('marker-hover');
        });

        markerEl.addEventListener('mouseleave', () => {
          markerEl.classList.remove('marker-hover');
        });
      });

      console.log('MapPage: All markers added successfully');
    });

    return () => map.remove();
  }, [mapboxToken]);

  const handleTokenSubmit = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      setShowTokenInput(false);
      setTokenInput("");
    }
  };

  const handleLocationSelect = (location: LocationPoint) => {
    setSelectedLocation(location);
    setIsPanelOpen(true);
    setIsExplorationOpen(false);
  };

  const renderLocationCard = (location: LocationPoint) => (
    <Card 
      key={location.id}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50"
      onClick={() => handleLocationSelect(location)}
    >
      <div className="relative h-32 overflow-hidden rounded-t-lg">
        <img
          src={location.images[0]}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={location.type === 'attraction' ? 'default' : 'secondary'} className="text-xs">
            {location.type === 'attraction' ? 'Attraction' : 'Craft'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{location.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{location.description}</p>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{location.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{location.checkIns.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (showTokenInput || !mapboxToken) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Mapbox Configuration</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Enter your Mapbox public token to display the map
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
            />
            <Button onClick={handleTokenSubmit} className="w-full" disabled={!tokenInput.trim()}>
              Save Token
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Get your token from{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                mapbox.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <div ref={mapRef} className="absolute inset-0 map-container" />
      
      {/* Mobile-first Exploration Panel - Bottom */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg transition-transform duration-300 z-40",
        "md:left-0 md:top-0 md:bottom-0 md:w-80 md:border-r md:border-t-0",
        isExplorationOpen ? "translate-y-0" : "translate-y-[calc(100%-4rem)]",
        "md:translate-y-0"
      )}>
        {/* Toggle Button - Mobile Only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExplorationOpen(!isExplorationOpen)}
          className="w-full flex items-center justify-center gap-2 h-16 md:hidden border-none rounded-none"
        >
          {isExplorationOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          <span className="font-medium">Explore Locations</span>
          <Badge variant="secondary" className="text-xs">
            {allLocations.length}
          </Badge>
        </Button>

        {/* Panel Content */}
        <div className="h-[60vh] md:h-full overflow-y-auto">
          <div className="hidden md:block p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Explore Quang Binh</h2>
            <p className="text-sm text-muted-foreground">Discover amazing destinations</p>
          </div>

          <div className="p-4 space-y-4">
            {/* Famous Places */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Famous Places
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {famousPlaces.map(renderLocationCard)}
              </div>
            </div>

            {/* Craft Villages */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Craft Villages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {craftVillages.map(renderLocationCard)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Detail Panel - Mobile: Bottom, Desktop: Right */}
      {isPanelOpen && selectedLocation && (
        <LocationPanel
          location={selectedLocation}
          onClose={() => {
            setIsPanelOpen(false);
            setSelectedLocation(null);
          }}
          className={cn(
            "md:right-0 md:top-0 md:h-full md:max-w-2xl",
            "mobile-panel"
          )}
        />
      )}
    </div>
  );
};

export default MapPage;
