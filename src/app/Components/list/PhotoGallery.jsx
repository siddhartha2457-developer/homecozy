"use client";

import "./PhotoGallery.css";

function PhotoGallery({ media = [], onMediaClick }) {
  // Filter out videos and only show images in the gallery
  const images = media.filter((item) => {
    console.log("Filtering media item:", item); // Debugging step
    return item.mimetype === "image" || !item.mimetype;
  });

  const previewImages = images.slice(0, 4); // Show only the first 5 images

  // Count how many more images are available
  const remainingCount = media.length - previewImages.length;

  return (
    <div className="photo-gallery">
    {previewImages.map((item, index) => (
      <div
        key={item._id || index}
        className={`gallery-item ${index === 0 ? "main-photo" : "secondary-photo"}`}
        onClick={() => onMediaClick(index)}
      >
        <img
          src={item.url || "/placeholder.svg?height=300&width=400"}
          alt={`Property photo ${index + 1}`}
          className="media-image"
          loading="lazy"
        />
      </div>
    ))}
    {remainingCount > 0 && (
      <div
        className="gallery-item secondary-photo more-photos"
        onClick={() => onMediaClick(previewImages.length)}
      >
        <img
          src={media[previewImages.length]?.url || "/placeholder.svg?height=300&width=400"}
          alt="More photos"
          className="media-image"
        />
      </div>
    )}
    <button
      className="show-all-photos"
      onClick={() => onMediaClick(0)}
    >
      <span className="grid-icon"></span>
      Show all media
    </button>
  </div>
  
  );
}

export default PhotoGallery;
