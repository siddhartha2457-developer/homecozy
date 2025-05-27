'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      try {
        const response = await axios.get`(https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5)`;
        setResults(response.data.features);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocations();
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Where are you going?"
      />
      <ul>
        {results.map((feature, index) => (
          <li key={index}>
            {feature.properties.name}, {feature.properties.city}, {feature.properties.country}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationSearch;