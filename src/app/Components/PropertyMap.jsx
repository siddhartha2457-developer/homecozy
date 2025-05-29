"use client"

import { useEffect, useRef, useState } from "react"
import "./PropertyMap.css"

const PropertyMap = ({
  properties = [],
  selectedProperty,
  onPropertySelect,
  zoom = 10,
  width = "100%",
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // Add random offset to coordinates to make them less accurate
  const addLocationOffset = (lat, lng) => {
    // Add random offset of 0.01 to 0.03 degrees (roughly 1-3km)
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

    // Dynamically import Leaflet
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

      // Determine center based on properties
      let defaultCenter = [22.5726, 88.3639] // Default to Kolkata

      if (properties.length > 0) {
        // Find properties with valid coordinates
        const validProperties = properties.filter(
          (p) =>
            p.latitude &&
            p.longitude &&
            !isNaN(p.latitude) &&
            !isNaN(p.longitude) &&
            p.latitude !== 0 &&
            p.longitude !== 0,
        )

        if (validProperties.length > 0) {
          // Use the first valid property's coordinates
          defaultCenter = [validProperties[0].latitude, validProperties[0].longitude]
          console.log("PropertyMap: Using property coordinates:", defaultCenter)
        } else {
          console.log("PropertyMap: No valid coordinates found, using default center")
        }
      }

      // Create map instance
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true,
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
  }, [zoom])

  // Update markers when properties change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !properties.length) return

    const updateMarkers = async () => {
      const L = await import("leaflet")

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Create custom icons
      const defaultIcon = L.divIcon({
        className: "custom-marker1",
        html: `
          <div class="marker-pin1">
            <div class="marker-content1">
              <span class="marker-price1"></span>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      })

      const selectedIcon = L.divIcon({
        className: "custom-marker1 selected",
        html: `
          <div class="marker-pin1 selected">
            <div class="marker-content1">
              <span class="marker-price1"></span>
            </div>
          </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      })

      const bounds = L.latLngBounds()
      let validMarkersCount = 0

      // Add markers for each property
      properties.forEach((property) => {
        // Validate coordinates
        if (
          !property.latitude ||
          !property.longitude ||
          isNaN(property.latitude) ||
          isNaN(property.longitude) ||
          property.latitude === 0 ||
          property.longitude === 0
        ) {
          console.warn(
            "PropertyMap: Invalid coordinates for property:",
            property.name,
            property.latitude,
            property.longitude,
          )
          return
        }

        // Add offset to make location less accurate
        const offsetCoords = addLocationOffset(property.latitude, property.longitude)

        const isSelected = selectedProperty === property.id
        const marker = L.marker([offsetCoords.lat, offsetCoords.lng], {
          icon: isSelected ? selectedIcon : defaultIcon,
        })

        // Create popup content
        const popupContent = `
          <div class="map-popup1">
            <div class="popup-image1">
              <img src="${property.image || ""}" 
                   alt="${property.name}" 
                   />
            </div>
            <div class="popup-content1">
              <h4>${property.name}</h4>
              <p class="popup-location1">📍 ${property.location}</p>
              <div class="popup-details1">
                <span>🛏️ ${property.totalRooms || 1} Rooms</span>
                <span>👥 Max ${property.maxAttendant || 2} Guests</span>
              </div>
              <div class="popup-price1">
                <span class="price1">₹${property.price ? property.price.toLocaleString() : "N/A"}</span>
                <span class="per-night1">per night</span>
              </div>
              <div class="popup-type1">${property.type || "Property"}</div>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup1",
        })

        // Handle marker click
        marker.on("click", () => {
          if (onPropertySelect) {
            onPropertySelect(property.id)
          }
        })

        marker.addTo(mapInstanceRef.current)
        markersRef.current.push(marker)
        bounds.extend([offsetCoords.lat, offsetCoords.lng])
        validMarkersCount++
      })

      // Fit map to show all markers if we have valid markers
      if (validMarkersCount > 0 && bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 15,
        })
      } else if (validMarkersCount === 0) {
        console.warn("PropertyMap: No valid markers to display")
      }
    }

    updateMarkers()
  }, [properties, selectedProperty, onPropertySelect, mapLoaded])

  return (
    <div className="property-map-container1" style={{ width }}>
      <div ref={mapRef} className="property-map1" style={{ width: "100%", height: "100%" }} />
      <div className="map-disclaimer1">
        <span>📍 Approximate locations shown for privacy</span>
      </div>
      <div className="property-count1">
        <span>{properties.length} properties found</span>
      </div>
    </div>
  )
}

export default PropertyMap
