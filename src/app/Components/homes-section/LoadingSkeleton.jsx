"use client"
import styles from "./HomesSection.module.css"

const LoadingSkeleton = ({ count = 4 }) => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonLocation} />
            <div className={styles.skeletonRating}>
              <div className={styles.skeletonScore} />
              <div className={styles.skeletonText} />
            </div>
            <div className={styles.skeletonPrice} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
