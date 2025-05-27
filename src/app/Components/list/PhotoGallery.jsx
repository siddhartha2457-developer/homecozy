import './PhotoGallery.css';

function PhotoGallery({ media = [], onMediaClick }) {
  // Filter out videos and only show images in the gallery
  const previewMedia = media.filter((item) => item.type !== 'video').slice(0, 6); // Show only the first 6 images

  return (
    <div className="photo-gallery">
      {previewMedia.map((item, index) => (
        <div
          key={item.id || index} // Use item.id if available, otherwise fallback to index
          className={item.className}
          onClick={() => onMediaClick(index)}
        >
          <img
            src={item.url || '/placeholder.svg'}
            alt={item.alt || 'media'}
            className="media-image"
          />
        </div>
      ))}

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
