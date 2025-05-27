'use client';

import { useEffect, useRef } from 'react';
import './MapComponent.css';

function MapComponent({ markers, zoom, height = 'auto', width = 'auto' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!window.L) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkElement);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => initializeMap();
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const L = window.L;
      const defaultCenter = markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [0, 0];
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      const villaIcon = L.icon({
        iconUrl: '/villa-marker.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      // Add markers dynamically
      markers.forEach(marker => {
        L.marker([marker.latitude, marker.longitude], { icon: villaIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<strong>${marker.title || 'Villa'}</strong><br>${marker.description || ''}`);
      });
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [markers, zoom]);

  return (
    <div className="map-container" style={{ width, height }}>
      <div ref={mapRef} className="map" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
}

export default MapComponent;
