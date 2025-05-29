"use client"

import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "./Icons"
import "./ImageModal.css"

function ImageModal({ images, selectedIndex: initialIndex = 0, onClose, onNext, onPrev }) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    setSelectedIndex(initialIndex)
  }, [initialIndex])

  const handleNext = () => {
    setIsLoading(true)
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length)
    if (onNext) onNext()
  }

  const handlePrev = () => {
    setIsLoading(true)
    setSelectedIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    if (onPrev) onPrev()
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  const currentMedia = images[selectedIndex] || {}
  const isVideo = currentMedia.mimetype === "video"

  return (
    <div className="image-modal-overlay">
      <div className="image-modal-header">
        <button className="modal-close-btn" onClick={onClose}>
          <X />
        </button>
        <div className="image-counter">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      <div className="image-modal-content">
        <button className="nav-button prev" onClick={handlePrev}>
          <ChevronLeft />
        </button>

        <div className="modal-image-container">
          {isLoading && <div className="modal-loading">Loading...</div>}

          {isVideo ? (
            <video controls className="modal-video" onLoadedData={handleVideoLoad} autoPlay playsInline>
              <source src={currentMedia.url} type="video/mp4" />
              <source src={currentMedia.url} type="video/webm" />
              <source src={currentMedia.url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentMedia.url || "/placeholder.svg?height=600&width=800"}
              alt={`Media ${selectedIndex + 1}`}
              className="modal-image"
              onLoad={handleImageLoad}
              style={{ opacity: isLoading ? 0 : 1 }}
            />
          )}
        </div>

        <button className="nav-button next" onClick={handleNext}>
          <ChevronRight />
        </button>
      </div>

      <div className="image-modal-thumbnails">
        {images.map((media, index) => (
          <div
            key={media._id || index}
            className={`thumbnail ${selectedIndex === index ? "active" : ""}`}
            onClick={() => {
              setSelectedIndex(index)
              setIsLoading(true)
            }}
          >
            {media.mimetype === "video" ? (
              <div className="video-thumbnail">
                <img src={media.url || "/placeholder.svg?height=100&width=100"} alt={`Thumbnail ${index + 1}`} />
                <div className="video-icon">▶</div>
              </div>
            ) : (
              <img src={media.url || "/placeholder.svg?height=100&width=100"} alt={`Thumbnail ${index + 1}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageModal
