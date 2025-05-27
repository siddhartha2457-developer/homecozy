import React from 'react';
import HomeCard from './homes-section/HomeCard';
import styles from './Detailcard.module.css';
// import { Link } from 'react-router';
import { Link } from 'react-router-dom';

const homes = [
  {
    id: 1,
    image: '/cottage.jpg',
    name: 'Himalayan Serenity Cottage',
    location: 'Manali, Himachal Pradesh',
    rating: 8.8,
    ratingText: 'Fabulous · 1,245 reviews',
    price: 8025
  },
  {
    id: 2,
    image: '/cottage2.jpg',
    name: 'Whispering Pines Retreat',
    location: 'Dharamshala, Himachal Pradesh',
    rating: 9.1,
    ratingText: 'Superb · 978 reviews',
    price: 11752
  },
  {
    id: 3,
    image: '/cottage3.jpg',
    name: 'Misty Meadows Homestay',
    location: 'Ooty, Tamil Nadu',
    rating: 9.0,
    ratingText: 'Superb · 1,382 reviews',
    price: 29760
  },
  {
    id: 4,
    image: '/cottage4.jpg',
    name: 'Cedar Heights Lodge',
    location: 'Mussoorie, Uttarakhand',
    rating: 8.3,
    ratingText: 'Very good · 694 reviews',
    price: 7032
  },
  {
    id: 5,
    image: '/cottage5.jpg',
    name: 'Cozy Retreat',
    location: 'Manali, India',
    rating: 9.1,
    ratingText: 'Exceptional · 500 reviews',
    price: 5500
  }
  // add more objects
];

const Detailcard = () => {
  return (
    <div className={styles.cardsContainer}>
      {homes.map((home, index) => (
        
        <HomeCard key={index} home={home} />
        
      ))}
    </div>
  );
};

export default Detailcard;
