'use client';

import React from 'react';
import './CityCards.css';
import TiltedCard from './TiltedCard';

const cities = [
  {
    name: 'New Delhi',
    country: 'India',
    image: '/delhi.jpg',
  },
  {
    name: 'Manali',
    country: 'India',
    image: '/manali.jpg',
  },
  {
    name: 'Mumbai',
    country: 'India',
    image: '/mumbai.jpg',
  },
  {
    name: 'Chennai',
    country: 'India',
    image: '/chennai.jpg',
  },
  {
    name: 'Varanasi',
    country: 'India',
    image: '/varanasi.jpg',
  },
  {
    name: 'Mumbai',
    country: 'India',
    image: '/mumbai.jpg',
  },
  {
    name: 'Mumbai',
    country: 'India',
    image: '/mumbai.jpg',
  },
  {
    name: 'Mumbai',
    country: 'India',
    image: '/mumbai.jpg',
  },
  

];

const CityCards = () => {
  return (
    <>
      <h2 className="citycard-heading">Destinations</h2>
      <section className="city-cards-container">
        {/* <div className="top-row">
          {cities.slice(0, 2).map((city, index) => (
            <div key={index} className="city-card large">
              <TiltedCard
                imageSrc={city.image}
                altText={`${city.name}, ${city.country}`}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="500px"
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
            </div>
          ))}
        </div> */}

        <div className="bottom-row">
          {cities.slice(0,8).map((city, index) => (
            <div key={index} className="city-card">
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CityCards;


