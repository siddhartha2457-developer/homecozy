"use client";

import React from 'react';
import Navbar from '../app/Components/Navbar';

// import HeroSearch from '../../HeroSearch';
// import './App.css';

import CityCards from '../app/Components/CityCards';
import HomesSection from '../app/Components/homes-section/HomesSection';
import Footer from '../app/Components/Footer';

// import LuxuryHighlights from './Components/LuxuryHighlights';
import CollectionSection from '../app/Components/CollectionSection';

// import FullScreenLoader from '../../Components/FullScreenLoader';
// import CategoryFilter from '../../Components/CategoryFilter'






import HeroSection from './Components/hero-section';

// import PegimHero from './Components/pegim-hero';

const Homepage = () => {
  return (
    <>
    {/* <Navbar /> */}
  
    <HeroSection></HeroSection>
    
    

    
    <div className='home-page'>
      
      <CityCards />
      
     
      <HomesSection />
      <CollectionSection />
    </div>

    
    <Footer />
</>
  )
}

export default Homepage