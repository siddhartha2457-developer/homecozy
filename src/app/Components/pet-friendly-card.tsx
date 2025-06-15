"use client"

import { useState } from "react"
import { Heart, PawPrint } from "lucide-react"
import styles from "./PetFriendlySection.module.css"

const PetFriendlyCard = ({ property }) => {
  const [liked, setLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        <div className={`${styles.imageContainer} ${imageLoaded ? styles.loaded : ""}`}>
          {!imageLoaded && <div className={styles.imageSkeleton} />}
          <img
            src={imageError ? "/placeholder.jpg" : property.image}
            alt={property.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </div>
        <button
          className={`${styles.heartBtn} ${liked ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setLiked(!liked)
          }}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} stroke="currentColor" />
        </button>
        <div className={styles.petFriendlyBadge}>
          <PawPrint size={14} />
          <span>Pet Friendly</span>
        </div>
      </div>
      <div className={styles.cardInfo}>
        <h3>{property.name}</h3>
        <p>{property.location}</p>
        <div className={styles.rating}>
          <span className={styles.ratingScore}>{property.rating}</span>
          <span className={styles.ratingText}>{property.ratingText}</span>
        </div>
        <div className={styles.price}>Starting from ₹{property.price.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default PetFriendlyCard
