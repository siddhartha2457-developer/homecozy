'use client';

import React from 'react';
import './CollectionSection.css';
import PixelCard from './PixelCard';
import Link from 'next/link';

const collections = [
  {
    title: 'Cottages in Kasol',
    subtitle: 'Top Collections',
    image: '/cot6.webp',
    city: 'Kasol',
  },
  {
    title: 'Cottages In Auli',
    subtitle: '',
    image: '/cot2.webp',
    city: 'Auli',
  },
  {
    title: 'Cottages In Manali',
    subtitle: '',
    image: '/cot3.webp',
    city: 'Manali',
  },
  {
    title: 'Cottages in Bhimtal',
    subtitle: '',
    image: '/cot4.webp',
    city: 'Bhimtal',
  },
];

const CollectionSection = () => {
  return (
    <div className="collection-section">
      <h2 className="collection-title">Our Favorite Cottage Escapes</h2>
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
