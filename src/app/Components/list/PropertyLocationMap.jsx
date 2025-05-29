"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import "./PropertyLocationMap.css";

const PropertyLocationMap = ({ propertyData }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Extract property location data
  const getPropertyLocation = () => {
    if (!propertyData || !propertyData.PropertyAddress || !propertyData.PropertyAddress[0]) {
      return null
    }

    const address = propertyData.PropertyAddress[0]
    return {
      lat: address.latitude,
      lng: address.longitude,
      name: address.propertyName,
      fullAddress: address.fullAddress,
      mapAddress: address.mapAddress,
      city: address.city,
      state: address.state,
    }
  }

  // Add random offset to coordinates for privacy
  const addLocationOffset = (lat, lng) => {
    // Add random offset of 0.015 to 0.025 degrees (roughly 1.5-2.5km)
    const offsetRange = 0.02
    const latOffset = (Math.random() - 0.5) * offsetRange
    const lngOffset = (Math.random() - 0.5) * offsetRange

    return {
      lat: lat + latOffset,
      lng: lng + lngOffset,
    }
  }

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined") return

    const initMap = async () => {
      const L = await import("leaflet")

      // Fix for default markers
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      const location = getPropertyLocation()
      const defaultCenter = location ? [location.lat, location.lng] : [22.5726, 88.3639]

      // Create map instance
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      mapInstanceRef.current = map
      setMapLoaded(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update marker when property data changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return

    const updateMarker = async () => {
      const L = await import("leaflet")
      const location = getPropertyLocation()

      if (!location) return

      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current)
      }

      // Add offset to coordinates for privacy
      const offsetCoords = addLocationOffset(location.lat, location.lng)

      // Create custom marker icon
      const customIcon = L.divIcon({
        className: "property-location-marker",
        html: `
          <div class="location-pin">
            <div class="pin-content">
              <div class="pin-icon">🏠</div>
            </div>
            <div class="pin-pulse"></div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 60],
      })

      // Create marker
      const marker = L.marker([offsetCoords.lat, offsetCoords.lng], {
        icon: customIcon,
      })

      // Create popup content
      const popupContent = `
        <div class="location-popup">
          <div class="popup-header">
            <h4>${location.name}</h4>
          </div>
          <div class="popup-body">
            <p class="address">📍 ${location.mapAddress || location.fullAddress}</p>
            <p class="city-state">${location.city}, ${location.state}</p>
            <div class="privacy-note">
              <small>🔒 Approximate location shown for privacy</small>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-location-popup",
      })

      marker.addTo(mapInstanceRef.current)
      markerRef.current = marker

      // Center map on the marker
      mapInstanceRef.current.setView([offsetCoords.lat, offsetCoords.lng], 14)
    }

    updateMarker()
  }, [propertyData, mapLoaded])

  const location = getPropertyLocation()

  if (!location) {
    return (
      <div className="map-placeholder">
        <div className="placeholder-content">
          <span className="placeholder-icon">📍</span>
          <p>Location information not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="property-location-map-container">
      <div className="map-header">
      <h3>Your stay location</h3>
        <p className="location-description">{location.mapAddress || location.fullAddress}</p>
      </div>

      <div className="map-wrapper">
        <div ref={mapRef} className="property-location-map" />
        <div className="map-overlay">
          
        </div>
      </div>

      {/* <div className="location-disclaimer">
        <div className="disclaimer-content">
          <span className="disclaimer-icon">🔒</span>
          <div className="disclaimer-text">
            <p>
              <strong>Exact location provided after booking</strong>
            </p>
            <p>
              For privacy and security, we show the approximate area. You'll get the exact address once your reservation
              is confirmed.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default PropertyLocationMap
