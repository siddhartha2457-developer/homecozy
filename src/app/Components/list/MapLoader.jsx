"use client"

import { useEffect, useState } from "react"

const MapLoader = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      link.integrity = "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
      link.crossOrigin = ""
      document.head.appendChild(link)
    }
  }, [])

  if (!isClient) {
    return (
      <div className="map-loading1">
        <div className="loading-spinner1"></div>
        <p>Loading map...</p>
      </div>
    )
  }

  return children
}

export default MapLoader
