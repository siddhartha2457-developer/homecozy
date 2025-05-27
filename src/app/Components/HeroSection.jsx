'use client';

import { useState } from "react";
import styles from './HeroSection.module.css';
import "./HeroSearch.css";
import Link from "next/link"; // Use Next.js Link for navigation

const indianCities = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata",
  "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal",
  "Vadodara", "Ludhiana", "Patna", "Agra", "Varanasi",
  "Ranchi", "Raipur", "Coimbatore", "Madurai", "Thiruvananthapuram",
  "Kochi", "Vijayawada", "Visakhapatnam", "Mysuru", "Jodhpur",
  "Udaipur", "Guwahati", "Amritsar", "Nashik", "Jabalpur",
  "Gwalior", "Dehradun", "Shimla", "Manali", "Rishikesh",
  "Haridwar", "Noida", "Gurgaon", "Faridabad", "Chandigarh",
  "Panaji", "Dharamshala", "Tiruchirappalli", "Prayagraj", "Ajmer",
  "Srinagar", "Shillong", "Puducherry"
];

const HeroSection = () => {
  const [city, setCity] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [Bedrooms, setBedRooms] = useState(1);
  const [pets, setPets] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.length > 0) {
      const suggestions = indianCities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(suggestions);
    } else {
      setFilteredCities([]);
    }
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setFilteredCities([]);
  };

  return (
    <div className={styles.hero}>
      <video
        className={styles.heroVideo}
        autoPlay
        loop
        muted
        playsInline
        src="/hero-vid.mp4" // Replace with your actual video path
      />
      <div className={styles.heroContent}>
        <div className="search-box">
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Enter city"
              className="input-city"
            />
            {filteredCities.length > 0 && (
              <ul className="suggestions">
                {filteredCities.map((c, idx) => (
                  <li key={idx} onClick={() => handleCitySelect(c)}>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="row">
            <div className="input-group">
              <label>Check In</label>
              <input
                type="date"
                className="input-date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Check out</label>
              <input type="date" className="input-date" min={startDate} />
            </div>
            <div className="input-group guest-group">
              <label>Guests</label>
              <div
                className="input-select"
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              >
                {adults} adult{adults > 1 ? "s" : ""}, {children} child
                {children !== 1 ? "ren" : ""}, {Bedrooms} Bedroom
                {Bedrooms > 1 ? "s" : ""}
              </div>
              {showGuestDropdown && (
                <div className="guest-dropdown">
                  {["Adults", "Children", "Bedroom"].map((label, index) => {
                    const count =
                      index === 0 ? adults : index === 1 ? children : Bedrooms;
                    const setCount =
                      index === 0
                        ? setAdults
                        : index === 1
                        ? setChildren
                        : setBedRooms;
                    return (
                      <div className="guest-row" key={label}>
                        <span>{label}</span>
                        <div className="counter">
                          <button
                            onClick={() => setCount(Math.max(0, count - 1))}
                          >
                            –
                          </button>
                          <span>{count}</span>
                          <button onClick={() => setCount(count + 1)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="divider"></div>
                  <div className="guest-pets">
                    <label>
                      Travelling with pets?
                      <input
                        type="checkbox"
                        checked={pets}
                        onChange={() => setPets(!pets)}
                      />
                      <span className="toggle"></span>
                    </label>
                    <p>Assistance animals aren’t considered pets.</p>
                  </div>
                  <button
                    className="guest-done-btn"
                    onClick={() => setShowGuestDropdown(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          <button className="search-btn">SEARCH</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;