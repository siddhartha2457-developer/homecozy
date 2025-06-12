"use client"

import Link from "next/link"
import Image from "next/image"
import "./destinations-section.css"

interface Destination {
  id: number
  city: string
  country: string
  image: string
  alt: string
}

const destinations: Destination[] = [
  {
    id: 1,
    city: "New Delhi",
    country: "India",
    image: "/delhi.webp",
    alt: "India Gate in New Delhi with blue sky background",
  },
  {
    id: 2,
    city: "Manali",
    country: "India",
    image: "/varanasi.webp",
    alt: "Snow-capped mountains and valley view in Manali",
  },
  {
    id: 3,
    city: "Mumbai",
    country: "India",
    image: "/mumbai.webp",
    alt: "Historic colonial architecture in Mumbai",
  },
  {
    id: 4,
    city: "Chennai",
    country: "India",
    image: "/chennai.webp",
    alt: "Colorful temple architecture in Chennai",
  },
  {
    id: 5,
    city: "Varanasi",
    country: "India",
    image: "/varanasi.webp",
    alt: "Evening view of ghats along the Ganges river in Varanasi",
  },
  {
    id: 6,
    city: "Kasol",
    country: "India",
    image: "/varanasi.webp",
    alt: "Mountain village landscape in Kasol",
  },
  {
    id: 7,
    city: "Rishikesh",
    country: "India",
    image: "/rishikesh.webp",
    alt: "Spiritual scene with person meditating in Rishikesh",
  },
  {
    id: 8,
    city: "Shimla",
    country: "India",
    image: "/shimla.webp",
    alt: "Snow-covered mountains and buildings in Shimla",
  },
]

export default function DestinationsSection() {
  return (
    <section className="destinations-section">
      <div className="destinations-container">
        <h2 className="destinations-title">Destinations</h2>

        <div className="destinations-grid">
          {destinations.map((item) => (
            <Link key={item.id} href={`/detail?q=${encodeURIComponent(item.city)}`} className="destination-card">
              <div className="destination-image-container">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="destination-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="destination-overlay">
                  <h3 className="destination-name">
                    {item.city}, {item.country}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
