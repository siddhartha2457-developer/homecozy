'use client';

import React from 'react';
import './CityCards.css';
import TiltedCard from './TiltedCard';
import Link from 'next/link';

const cities = [
  {
    name: 'New Delhi',
    country: 'India',
    image: '/delhi.webp',
  },
  {
    name: 'Manali',
    country: 'India',
    image: '/manali.webp',
  },
  {
    name: 'Mumbai',
    country: 'India',
    image: '/mumbai.webp',
  },
  {
    name: 'Chennai',
    country: 'India',
    image: '/chennai.webp',
  },
  {
    name: 'Varanasi',
    country: 'India',
    image: '/varanasi.webp',
  },
  {
    name: 'Kasol',
    country: 'India',
    image: '/kasol.webp',
  },
  {
    name: 'Rishikesh',
    country: 'India',
    image: '/rishikesh.webp',
  },
  {
    name: 'Shimla',
    country: 'India',
    image: '/shimla.webp',
  },
];

const CityCards = () => {
  return (
    <>
      <h2 className="citycard-heading">Destinations</h2>
      <section className="city-cards-container">
        <div className="bottom-row">
          {cities.slice(0, 8).map((city, index) => (
            <Link
              key={index}
              href={`/detail?q=${encodeURIComponent(city.name)}`}
              className="city-card"
            >
              <TiltedCard
                imageSrc={city.image}
                altText={`${city.name}, ${city.country}`}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.2}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={
                  <p className="tilted-card-demo-text">
                    {city.name}, {city.country}
                  </p>
                }
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default CityCards;


