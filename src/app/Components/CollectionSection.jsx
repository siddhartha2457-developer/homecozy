'use client';

import React from 'react';
import './CollectionSection.css';
import PixelCard from './PixelCard';

const collections = [
  {
    title: 'Newly Launched',
    subtitle: 'Top Collections',
    image: '/cch.jpg',
  },
  {
    title: 'Cottages In Dhamsala',
    subtitle: '',
    image: '/cct.webp',
  },
  {
    title: 'Cottages In Manali',
    subtitle: '',
    image: '/ccw.webp',
  },
  {
    title: 'Cottages in Pilgiri',
    subtitle: '',
    image: '/cco.jpg',
  },
];

const CollectionSection = () => {
  return (
    <div className="collection-section">
      <h2 className="collection-title">Choose a Collection</h2>
      <div className="collection-grid">
        {collections.map((item, index) => (
          <PixelCard key={index} variant="default">
            <div className="collection-card">
              <img src={item.image} alt={item.title} />
              <div className="card-overlay">
                {item.subtitle && <p className="card-subtitle">{item.subtitle}</p>}
                <h3 className="card-title">{item.title}</h3>
              </div>
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  );
};

export default CollectionSection;
