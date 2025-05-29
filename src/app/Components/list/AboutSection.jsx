"use client"

import { useState } from "react"
import "./AboutSection.css"

const AboutSection = ({ propertyData }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Generate simple content based on property data
  const getAboutContent = () => {
    const propertyName = propertyData?.PropertyAddress?.[0]?.propertyName || "This property"
    const location = propertyData?.PropertyAddress?.[0]?.city || "this beautiful location"
    const propertyType = propertyData?.PropertyCategory?.[0]?.title?.toLowerCase() || "accommodation"
    const maxGuests = propertyData?.fullproperty?.[0]?.maxAttendant || 2
    const totalRooms = propertyData?.fullproperty?.[0]?.totalRooms || 1

    const previewText = `Kick back and relax in this ${propertyType} in beautiful ${location}. It's stylishly designed and equipped with everything you need for a refreshing stay.

The property features ${totalRooms} ${totalRooms === 1 ? "bedroom" : "bedrooms"} and can accommodate up to ${maxGuests} guests comfortably. Each room is thoughtfully designed to ensure a comfortable stay.

There is also a well-equipped space for all your needs...`

    const fullText = `Kick back and relax in this ${propertyType} in beautiful ${location}. It's stylishly designed and equipped with everything you need for a refreshing stay.

The property features ${totalRooms} ${totalRooms === 1 ? "bedroom" : "bedrooms"} and can accommodate up to ${maxGuests} guests comfortably. Each room is thoughtfully designed to ensure a comfortable stay with quality furnishings and modern amenities.

There is also a well-equipped space for all your needs, including a functional area for relaxation and daily activities. The property has been carefully maintained to provide a clean, comfortable environment for all guests.

The location offers easy access to local attractions, dining options, and transportation links. Whether you're visiting for business or leisure, you'll find this property provides an ideal base for your stay.

We've taken care to ensure that all essential amenities are provided, from comfortable bedding to necessary household items. The space is designed to feel like a home away from home, allowing you to settle in quickly and enjoy your visit.

The neighborhood is safe and welcoming, with friendly locals and a variety of nearby conveniences. You'll have everything you need within easy reach while enjoying the peaceful atmosphere of the area.

We're committed to providing excellent hospitality and ensuring your stay exceeds expectations. Our goal is to make your visit memorable and comfortable from the moment you arrive until your departure.`

    return {
      preview: previewText,
      full: fullText,
    }
  }

  const content = getAboutContent()
  const displayText = isExpanded ? content.full : content.preview

  return (
    <div className="about-section-simple">
      <h2 className="about-heading-simple">About this place</h2>

      <div className="about-text-simple">
        {displayText.split("\n\n").map((paragraph, index) => (
          <p key={index} className="about-paragraph-simple">
            {paragraph.trim()}
          </p>
        ))}
      </div>

      <button className="show-more-button-simple" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  )
}

export default AboutSection
