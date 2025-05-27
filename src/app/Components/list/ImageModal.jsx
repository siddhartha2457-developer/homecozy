'use client';
import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from './Icons';
import './ImageModal.css';

function ImageModal({ images, selectedIndex, onClose, onNext, onPrev, setSelectedIndex }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

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
        <button className="nav-button prev" onClick={onPrev}>
          <ChevronLeft />
        </button>
        
        <div className="modal-image-container">
  {images[selectedIndex].type === 'image' ? (
    <img 
      src={images[selectedIndex].url || "/placeholder.svg"} 
      alt={images[selectedIndex].alt} 
      className="modal-image"
    />
  ) : (


    <img 
      src={images[selectedIndex].url || "/placeholder.svg"} 
      alt={images[selectedIndex].alt} 
      className="modal-image"
    />
    // <video controls className="modal-image">
    //   <source src={images[selectedIndex].url} type="video/mp4" />
    //   Your browser does not support the video tag.
    // </video>
  )}
</div>
        <button className="nav-button next" onClick={onNext}>
          <ChevronRight />
        </button>
      </div>
      
      <div className="image-modal-thumbnails">
        {images.map((image, index) => (
          <div 
            key={image.id} 
            className={`thumbnail ${selectedIndex === index ? 'active' : ''}`}
            onClick={() => {
              setSelectedIndex(index); // ✅ update index here
              const imageElement = document.querySelector('.modal-image');
              if (imageElement) {
                imageElement.classList.add('fade');
                setTimeout(() => {
                  imageElement.classList.remove('fade');
                }, 300);
              }
            }}
          >
           {image.type === 'image' ? (
  <img src={image.url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} />
) : (

  <img src={image.url || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} />
  // <video className="thumbnail-video">
  //   <source src={image.url} type="video/mp4" />
  // </video>
)}
          </div>
        ))}
      </div>
    </div>
  );
}


export default ImageModal;