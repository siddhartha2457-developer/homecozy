"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Amenities = ({ amenities }) => {
  const [showAll, setShowAll] = useState(false);
  const [amenitiesMap, setAmenitiesMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch amenities data from the API
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch("https://host.cozyhomestays.com/api/aminity");
        const data = await response.json();
        const map = {};
        data.aminity.forEach((item) => {
          map[item._id] = { name: item.title, icon: item.icon };
        });
        setAmenitiesMap(map);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching amenities data:", error);
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  // Debug: Check the amenities prop
  // console.log("Amenities prop:", amenities);

  if (loading) {
    return <div>Loading amenities...</div>;
  }

  if (!amenities || amenities.length === 0) {
    console.log("No amenities provided.");
    return <div>No amenities available for this property.</div>;
  }

  // Map amenities IDs to their names and icons
  const mappedAmenities = amenities
    .map((id) => {
      const amenity = amenitiesMap[id];
      if (!amenity) {
        console.warn(`No mapping found for amenity ID: ${id}`);
        return null;
      }
      return { name: amenity.name, icon: amenity.icon };
    })
    .filter(Boolean); // Remove null values

  // Debug: Check the mapped amenities
  // console.log("Mapped Amenities:", mappedAmenities);

  // Show only the first 6 amenities initially
  const displayedAmenities = showAll ? mappedAmenities : mappedAmenities.slice(0, 6);

  return (
    <div className="amenities-container">
      <h2 className="amenties-headline">Included Amenities</h2>

      <div className={`amenities-grid ${showAll ? "expanded" : ""}`}>
        {displayedAmenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <div className="amenity-icon">
              <Icon icon={amenity.icon} />
            </div>
            <div className="amenity-name">{amenity.name}</div>
          </div>
        ))}
      </div>

      {mappedAmenities.length > 6 && (
        <button className="view-all-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "Show all amenities"}
        </button>
      )}

      <style jsx>{`
        .amenities-container {
          padding: 24px 0;
          border-bottom: 1px solid #DDDDDD;
        }

        .amenties-headline {

        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .amenities-grid.expanded {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 16px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .amenity-icon {
          color: #222222;
          font-size: 24px;
        }

        .amenity-name {
          font-size: 16px;
        }

        .view-all-btn {
          background-color: transparent;
          border: 1px solid #222222;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn:hover {
          background-color: #f7f7f7;
        }

        @media (min-width: 768px) {
          .amenities-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default Amenities;
