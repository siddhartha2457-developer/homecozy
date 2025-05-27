import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/animation/loading.json'; // adjust path as needed
import './FullScreenLoader.css';

const FullScreenLoader = () => {
  return (
    <div className="fullscreen-loader">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default FullScreenLoader;
