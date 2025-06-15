"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSwipeable } from "react-swipeable"
import styles from "./PetFriendlySection.module.css"
import PetFriendlyCard from "./pet-friendly-card"
import LoadingSkeleton from "./loading-skeleton"

// Define the property types based on your API response
interface Property {
  id: string
  image: string
  name: string
  location: string
  rating: number
  ratingText: string
  price: number
}

const PET_FRIENDLY_AMENITY_ID = "682dfa47a7e54c68fec49b21"

const PetFriendlySection = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(4)

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth
      if (width < 480) {
        setVisibleCount(1)
      } else if (width < 768) {
        setVisibleCount(2)
      } else if (width < 1024) {
        setVisibleCount(3)
      } else {
        setVisibleCount(4)
      }
    }

    updateVisibleCount()
    window.addEventListener("resize", updateVisibleCount)
    return () => window.removeEventListener("resize", updateVisibleCount)
  }, [])

  // Fetch data from the backend API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://sampledemo.shop/api/scearch")
        const data = await response.json()

        if (!data || !data.success || !Array.isArray(data.data)) {
          throw new Error("Invalid API response")
        }

        // Map and filter properties that have the pet-friendly amenity
        const allProperties = data.data.map((property: any) => {
          // Check if property has PropertyAminity array with pet-friendly amenity
          const propertyAminities = property.PropertyAminity || []
          const isPetFriendly = propertyAminities.some(
            (aminity: any) => Array.isArray(aminity.amenities) && aminity.amenities.includes(PET_FRIENDLY_AMENITY_ID),
          )

          // If not pet-friendly, we'll filter it out later
          if (!isPetFriendly) return null

          const fullPropertyDetails = property.fullproperty && property.fullproperty[0]

          // Get main image
          let mainImage = ""
          if (fullPropertyDetails && fullPropertyDetails.mediaInput) {
            const mainImageObj = fullPropertyDetails.mediaInput.find((img: any) => img.isMain)
            if (mainImageObj) {
              mainImage = mainImageObj.path.replace(/\\/g, "/")
              if (!mainImage.startsWith("http")) {
                mainImage = `https://sampledemo.shop/${mainImage}`
              }
            }
          }

          return {
            id: property.PropertyFullPrice?.[0]?.propertyId || property.propertyId || "unknown",
            image: mainImage || "/placeholder.jpg",
            name: property.PropertyAddress?.[0]?.propertyName || "Untitled Property",
            location: property.PropertyAddress?.[0]?.city || "Unknown Location",
            rating: property.PropertyFullPrice?.[0]?.rating || 4.5,
            ratingText: property.PropertyFullPrice?.[0]?.ratingText || "27 reviews",
            price: property.PropertyFullPrice?.[0]?.fullprice || 0,
          }
        })

        // Filter out null values (non-pet-friendly properties)
        const petFriendlyProperties = allProperties.filter(Boolean).reverse()

        // Limit to 15 properties max
        setProperties(petFriendlyProperties.slice(0, 15))
      } catch (error) {
        console.error("Error fetching pet-friendly properties:", error)
        setError("Failed to load pet-friendly properties. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, properties.length - visibleCount))
  }

  const canGoPrev = startIndex > 0
  const canGoNext = startIndex + visibleCount < properties.length

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canGoNext) handleNext()
    },
    onSwipedRight: () => {
      if (canGoPrev) handlePrev()
    },
    trackMouse: true, // Enable mouse dragging
  })

  if (loading) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Pet-Friendly Stays</h2>
        </div>
        <LoadingSkeleton count={visibleCount} />
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Pet-Friendly Stays</h2>
        </div>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Pet-Friendly Stays</h2>
        </div>
        <div className={styles.noResults}>
          <p>No pet-friendly properties available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.homesSection}>
      <div className={styles.header}>
        <h2>Pet-Friendly Stays</h2>
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${!canGoPrev ? styles.disabled : ""}`}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous pet-friendly properties"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`${styles.navButton} ${!canGoNext ? styles.disabled : ""}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next pet-friendly properties"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.carouselWrapper} {...swipeHandlers}>
        <div className={styles.carouselContainer}>
          <div
            className={styles.cardContainer}
            style={{
              transform: `translateX(-${(startIndex * 100) / visibleCount}%)`,
            }}
          >
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`} className={styles.cardLink}>
                <PetFriendlyCard property={property} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PetFriendlySection
