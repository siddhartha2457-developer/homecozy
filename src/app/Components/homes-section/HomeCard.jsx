"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import styles from "./HomesSection.module.css"

const HomeCard = ({ home, onClick }) => {
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
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardImg}>
        <div className={`${styles.imageContainer} ${imageLoaded ? styles.loaded : ""}`}>
          {!imageLoaded && <div className={styles.imageSkeleton} />}
          <img
            src={imageError ? "/placeholder.jpg" : home.image}
            alt={home.name}
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
      </div>
      <div className={styles.cardInfo}>
        <h3>{home.name}</h3>
        <p>{home.location}</p>
        <div className={styles.rating}>
          <span className={styles.ratingScore}>{home.rating}</span>
          <span className={styles.ratingText}>{home.ratingText}</span>
        </div>
        <div className={styles.price}>Starting from ₹{home.price.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default HomeCard
