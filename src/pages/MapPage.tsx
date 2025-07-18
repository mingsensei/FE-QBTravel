import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../Map.css'; // file css chứa marker + popup
import { allLocations } from '@/data/locations';
import { LocationPoint } from '@/types/map';

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obmJpZGF0IiwiYSI6ImNtZDJocDE2cTBheWYybHBxNDZxeDZ5YmkifQ.8HhkYUtlOo5UrZpguhMPrw';

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

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
    if (!mapRef.current) return;

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
          popup.setLngLat(location.coordinates).addTo(map);
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
  }, []);

  return <div ref={mapRef} className="map-container" />;
};

export default MapPage;
