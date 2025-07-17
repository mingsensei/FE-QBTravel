import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../Map.css'; // file css chứa marker + popup

mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obmJpZGF0IiwiYSI6ImNtZDJocDE2cTBheWYybHBxNDZxeDZ5YmkifQ.8HhkYUtlOo5UrZpguhMPrw';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description?: string;
}

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/standard-satellite',
      center: [106.6, 17.5],
      zoom: 9,
    });

    map.on('load', async () => {
      try {
        const res = await fetch('http://localhost:8081/api/locations');
        if (!res.ok) throw new Error('Lỗi khi gọi API');
        const data: Location[] = await res.json();

        data.forEach((loc: Location) => {
          // Tạo phần tử marker
          const el = document.createElement('div');
          el.className = 'marker'; // dùng class giống HTML
          
          const img = document.createElement('img');
          img.src = loc.imageUrl;
          img.alt = loc.name;
          el.appendChild(img);

          // Thêm marker vào map
          new mapboxgl.Marker(el)
            .setLngLat([loc.longitude, loc.latitude])
            .addTo(map);

          // Thêm popup luôn hiện
          new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: false,
              className: 'custom-popup',
            })
            .setLngLat([loc.longitude, loc.latitude])
            .setHTML(`
              <h3>${loc.name}</h3>
              <p>${loc.description ?? ''}</p>
              <small>${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}</small>
            `)
            .addTo(map);
        });
      } catch (error) {
        console.error('Lỗi khi tải địa điểm:', error);
      }
    });

    return () => map.remove();
  }, []);

  return <div ref={mapRef} className="map-container" />;
};

export default MapPage;
