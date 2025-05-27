"use client"

import { useState, useEffect } from "react"
import { FaHome, FaBuilding, FaHotel, FaWarehouse, FaUmbrellaBeach, FaMountain } from "react-icons/fa"
import "./PropertyTypeSelector.css"

// Static property types - no backend fetching
const propertyTypes = [
  { id: "house", name: "House", icon: <FaHome /> },
  { id: "apartment", name: "Apartment", icon: <FaBuilding /> },
  { id: "hotel", name: "Hotel", icon: <FaHotel /> },
  { id: "villa", name: "Villa", icon: <FaWarehouse /> },
  { id: "cottage", name: "Cottage", icon: <FaUmbrellaBeach /> },
  { id: "homestay", name: "Homestay", icon: <FaMountain /> },
]

const PropertyTypeSelector = ({ onTypeSelect, selectedType = null, onClearFilters }) => {
  const [activeType, setActiveType] = useState(selectedType)

  // Update local state when parent state changes (for clear filters)
  useEffect(() => {
    setActiveType(selectedType)
  }, [selectedType])

  const handleTypeSelect = (typeId) => {
    const newSelectedType = activeType === typeId ? null : typeId
    setActiveType(newSelectedType)

    if (onTypeSelect) {
      onTypeSelect(newSelectedType)
    }
  }

  return (
    <div className="property-type-tabs-wrapper">
      <div className="property-type-tabs-container">
        {propertyTypes.map((type) => (
          <button
            key={type.id}
            className={`property-type-tab ${activeType === type.id ? "active" : ""}`}
            onClick={() => handleTypeSelect(type.id)}
            type="button"
          >
            <div className="tab-icon">{type.icon}</div>
            <span className="tab-label">{type.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PropertyTypeSelector
