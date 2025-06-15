import styles from "./PetFriendlySection.module.css"

interface LoadingSkeletonProps {
  count: number
}

const LoadingSkeleton = ({ count }: LoadingSkeletonProps) => {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={styles.skeletonImage}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonLocation}></div>
            <div className={styles.skeletonRating}>
              <div className={styles.skeletonScore}></div>
              <div className={styles.skeletonText}></div>
            </div>
            <div className={styles.skeletonPrice}></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
