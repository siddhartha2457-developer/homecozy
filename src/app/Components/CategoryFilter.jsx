"use client";

import { useState, useRef, useEffect } from "react";
import {
  FaWifi,
  FaTv,
  FaUtensils,
  FaSoap,
  FaParking,
  FaCar,
  FaSnowflake,
  FaLaptop,
  FaCoffee,
  FaSwimmer,
  FaHotTub,
  FaChair,
  FaFireAlt,
  FaBroom,
  FaTable,
  FaCampground,
  FaSwimmingPool,
  FaDumbbell,
  FaPaw,
  FaPiano,
  FaWater,
  FaUmbrellaBeach,
  FaSkiing,
  FaShower,
  FaBell,
  FaMedkit,
  FaShieldAlt,
  FaVideo,
  FaGlassCheers,
  FaSpa,
  FaConciergeBell,
  FaFan,
  FaElevator,
  FaChargingStation,
  FaBaby,
  FaBicycle,
  FaMountain,
  FaFire,
  FaBed,
  FaDesk,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./CategoryFilter.css";

// Debugging: Log all imported icons

// Map of category IDs to their display names and icons
const categories = [
  { id: "wifi", name: "Free Wi-Fi", icon: <FaWifi /> },
  { id: "tv", name: "TV", icon: <FaTv /> },
  { id: "kitchen", name: "Kitchen", icon: <FaUtensils /> },
  { id: "laundry", name: "Laundry", icon: <FaSoap /> },
  { id: "free_parking", name: "Free Parking", icon: <FaParking /> },
  { id: "paid_parking", name: "Paid Parking", icon: <FaCar /> },
  { id: "ac", name: "Air Conditioning", icon: <FaSnowflake /> },
  { id: "workspace", name: "Dedicated Workspace", icon: <FaLaptop /> },
  { id: "breakfast", name: "Include Breakfast", icon: <FaCoffee /> },
  { id: "pool", name: "Swimming Pool", icon: <FaSwimmer /> },
  { id: "hottub", name: "Hot Tub", icon: <FaHotTub /> },
  { id: "patio", name: "Patio", icon: <FaChair /> },
  { id: "bbq", name: "BBQ Grill", icon: <FaFireAlt /> },
  { id: "dining_area", name: "Dining Area", icon: <FaTable /> },
  { id: "campfire", name: "Campfire/Firepit", icon: <FaCampground /> },
  { id: "pool_table", name: "Pool Table", icon: <FaSwimmingPool /> },
  { id: "fireplace", name: "Indoor Fireplace", icon: <FaFire /> },
  // { id: "piano", name: "Piano", icon: <FaPiano /> },
  { id: "gym", name: "Fitness Center", icon: <FaDumbbell /> },
  { id: "lake_access", name: "Lake Access", icon: <FaWater /> },
  { id: "beach_access", name: "Beach Access", icon: <FaUmbrellaBeach /> },
  { id: "ski_in", name: "Ski-In/Ski-Out", icon: <FaSkiing /> },
  { id: "outdoor_shower", name: "Outdoor Shower", icon: <FaShower /> },
  { id: "smoke_alarm", name: "Smoke Alarm", icon: <FaBell /> },
  { id: "first_aid_kit", name: "First Aid Kit", icon: <FaMedkit /> },
  { id: "carbon_monoxide_alarm", name: "Carbon Monoxide Alarm", icon: <FaBell /> },
  { id: "security", name: "Security", icon: <FaShieldAlt /> },
  { id: "cctv", name: "CCTV", icon: <FaVideo /> },
  { id: "restaurant", name: "Restaurant", icon: <FaConciergeBell /> },
  { id: "bar", name: "Bar", icon: <FaGlassCheers /> },
  { id: "spa", name: "Spa", icon: <FaSpa /> },
  { id: "room_service", name: "Room Service", icon: <FaConciergeBell /> },
  { id: "pets", name: "Pet Friendly", icon: <FaPaw /> },
  { id: "fridge", name: "Fridge", icon: <FaBroom /> },
  // { id: "microwave", name: "Microwave", icon: <FaGrinStars /> },
  { id: "coffee_maker", name: "Coffee Maker", icon: <FaCoffee /> },
  { id: "baby_facilities", name: "Baby Facilities", icon: <FaBaby /> },
  // { id: "hair_dryer", name: "Hair Dryer", icon: <FaGrinStars /> },
  { id: "ceiling_fan", name: "Ceiling Fan", icon: <FaFan /> },
  // { id: "elevator", name: "Elevator", icon: <FaElevator /> },
  { id: "ev_charging", name: "EV Charging", icon: <FaChargingStation /> },
  { id: "tent_space", name: "Tent Space", icon: <FaCampground /> },
  { id: "bike_rental", name: "Bike Rental", icon: <FaBicycle /> },
  { id: "mountain", name: "Mountain View", icon: <FaMountain /> },
  { id: "bedrooms", name: "2 Bedrooms", icon: <FaBed /> },
  // { id: "desk", name: "Desk", icon: <FaDesk /> },
];

const CategoryFilter = ({ 
  onFilterChange,
  availableAmenities = [],
  selectedCategories = [], // Add prop to receive selected categories from parent
  onClearFilters,
}) => {
  const [activeCategories, setActiveCategories] = useState(selectedCategories)
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const containerRef = useRef(null);


  
  // Update local state when parent state changes (for clear filters)
  useEffect(() => {
    setActiveCategories(selectedCategories)
  }, [selectedCategories])


  const displayCategories =
    availableAmenities.length > 0
      ? categories.filter((cat) => availableAmenities.includes(cat.id))
      : categories;

  const toggleCategory = (categoryId) => {
    const newActiveCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter((id) => id !== categoryId)
      : [...activeCategories, categoryId];

    setActiveCategories(newActiveCategories);

    if (onFilterChange) {
      onFilterChange(newActiveCategories);
    }
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const newPosition = container.scrollLeft;
    setScrollPosition(newPosition);

    setShowLeftArrow(newPosition > 0);
    setShowRightArrow(newPosition < container.scrollWidth - container.clientWidth - 10);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setShowRightArrow(container.scrollWidth > container.clientWidth);
    }
  }, [displayCategories]);

  return (
    <div className="category-filter-wrapper">
      {showLeftArrow && (
        <button className="nav-button left-button" onClick={() => scroll("left")} aria-label="Scroll left">
          <FaChevronLeft />
        </button>
      )}

      <div className="category-filter-container" ref={containerRef} onScroll={handleScroll}>
        {displayCategories.map((category) => (
          <div
            key={category.id}
            className={`category-item ${activeCategories.includes(category.id) ? "active" : ""}`}
            onClick={() => toggleCategory(category.id)}
          >
            <div className="icon-wrapper">{category.icon}</div>
            <div className="label">{category.name}</div>
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button className="nav-button right-button" onClick={() => scroll("right")} aria-label="Scroll right">
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
