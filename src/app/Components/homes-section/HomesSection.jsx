"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable"; // Import react-swipeable
import styles from "./HomesSection.module.css";
import HomeCard from "./HomeCard";
import LoadingSkeleton from "./LoadingSkeleton";

const HomesSection = () => {
  const [homes, setHomes] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setVisibleCount(1);
      } else if (width < 768) {
        setVisibleCount(2);
      } else if (width < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Fetch data from the backend API
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://sampledemo.shop/api/scearch");
        const data = await response.json();

        if (!data || !data.success || !Array.isArray(data.data)) {
          throw new Error("Invalid API response");
        }

        const mappedHomes = data.data.map((property) => {
          const fullPropertyDetails = property.fullproperty && property.fullproperty[0];

          let mainImage = "";
          if (fullPropertyDetails && fullPropertyDetails.mediaInput) {
            const mainImageObj = fullPropertyDetails.mediaInput.find((img) => img.isMain);
            if (mainImageObj) {
              mainImage = mainImageObj.path.replace(/\\/g, "/");
              if (!mainImage.startsWith("http")) {
                mainImage = `https://sampledemo.shop/${mainImage}`;
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
          };
        });

        // Limit to exactly 15 cards
        setHomes(mappedHomes.reverse().slice(0, 15));
      } catch (error) {
        console.error("Error fetching homes:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, homes.length - visibleCount));
  };

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + visibleCount < homes.length;

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canGoNext) handleNext();
    },
    onSwipedRight: () => {
      if (canGoPrev) handlePrev();
    },
    trackMouse: true, // Enable mouse dragging
  });

  if (loading) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Homes guests love</h2>
        </div>
        <LoadingSkeleton count={visibleCount} />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Homes guests love</h2>
        </div>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (homes.length === 0) {
    return (
      <section className={styles.homesSection}>
        <div className={styles.header}>
          <h2>Homes guests love</h2>
        </div>
        <div className={styles.noResults}>
          <p>No properties available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.homesSection}>
      <div className={styles.header}>
        <h2>Homes guests love</h2>
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${!canGoPrev ? styles.disabled : ""}`}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Previous properties"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`${styles.navButton} ${!canGoNext ? styles.disabled : ""}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next properties"
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
            {homes.map((home) => (
              <Link key={home.id} href={`/property/${home.id}`} className={styles.cardLink}>
                <HomeCard home={home} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomesSection;
