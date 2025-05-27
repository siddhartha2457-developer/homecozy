'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

import Star from '../animation/star.json';
import Award from '../animation/award.json';
import Travel from '../animation/travel.json';

import './LuxuryHighlights.css';

const LuxuryHighlights = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client side
  }, []);

  if (!isClient) return null; // Prevent rendering on the server

  return (
    <div className="luxury-section">
      <h2 className="luxury-title">India's Trusted Luxury Villa Rentals</h2>
      <div className="luxury-cards">
        <div className="luxury-card">
          <div className="lottie-wrapper">
            <Lottie animationData={Star} loop={true} />
          </div>
          <h3 className="card-title">Premium Stays</h3>
          <p className="card-desc">Curated cottages in scenic locations for a luxurious retreat</p>
        </div>

        <div className="luxury-card">
          <div className="lottie-wrapper">
            <Lottie animationData={Award} loop={true} />
          </div>
          <h3 className="card-title">Award-Winning Hospitality</h3>
          <p className="card-desc">Recognized for excellence in service and guest satisfaction</p>
        </div>

        <div className="luxury-card">
          <div className="lottie-wrapper">
            <Lottie animationData={Travel} loop={true} />
          </div>
          <h3 className="card-title">Seamless Travel Support</h3>
          <p className="card-desc">Personalized concierge service and local guidance</p>
        </div>
      </div>
    </div>
  );
};

export default LuxuryHighlights;
