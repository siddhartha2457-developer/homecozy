"use client"

import { Star } from "lucide-react"
import { PawPrintIcon as Paw } from "lucide-react"
import "./property-card.css"

interface PropertyCardProps {
  property: {
    id: string
    image: string
    name: string
    location: string
    rating: number
    ratingText: string
    price: number
  }
  isPetFriendly?: boolean
}

const PropertyCard = ({ property, isPetFriendly = false }: PropertyCardProps) => {
  return (
    <div className="property-card">
      <div className="property-image-container">
        <img src={property.image || "/placeholder.svg"} alt={property.name} className="property-image" />
        {isPetFriendly && (
          <div className="pet-friendly-badge">
            <Paw size={14} />
            <span>Pet Friendly</span>
          </div>
        )}
      </div>
      <div className="property-content">
        <h3 className="property-name">{property.name}</h3>
        <p className="property-location">{property.location}</p>
        <div className="property-rating">
          <Star size={16} className="star-icon" />
          <span className="rating-value">{property.rating}</span>
          <span className="rating-text">({property.ratingText})</span>
        </div>
        <div className="property-price">
          <span className="price-value">₹{property.price.toLocaleString()}</span>
          <span className="price-period">/ night</span>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
