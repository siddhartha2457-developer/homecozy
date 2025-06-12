'use client';

import React from 'react';
import './CollectionSection.css';
import PixelCard from './PixelCard';
import Link from 'next/link';

const collections = [
  {
    title: 'Cottages in Kasol',
    subtitle: 'Top Collections',
    image: '/cch.jpg',
    city: 'Kasol',
  },
  {
    title: 'Cottages In Dhamsala',
    subtitle: '',
    image: '/cct.webp',
    city: 'Dharamshala',
  },
  {
    title: 'Cottages In Manali',
    subtitle: '',
    image: '/ccw.webp',
    city: 'Manali',
  },
  {
    title: 'Cottages in Pilgiri',
    subtitle: '',
    image: '/cco.jpg',
    city: 'Pilgiri',
  },
];

const CollectionSection = () => {
  return (
    <div className="collection-section">
      <h2 className="collection-title">Choose a Collection</h2>
      <div className="collection-grid">
        {collections.map((item, index) => (
          <Link
            key={index}
            href={`/detail?q=${encodeURIComponent(item.city)}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <PixelCard variant="default">
              <div className="collection-card">
                <img src={item.image} alt={item.title} />
                <div className="card-overlay">
                  {item.subtitle && <p className="card-subtitle">{item.subtitle}</p>}
                  <h3 className="card-title">{item.title}</h3>
                </div>
              </div>
            </PixelCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionSection;
