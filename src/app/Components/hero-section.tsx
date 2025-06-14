"use client";

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users, Menu, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import "./hero-section.css"
import CalendarDropdown from "./CalendarDropdown";

// import "./CalendarDropdown";

import { parse, format } from "date-fns";

const formatDate = (dateString: string | null) => {
  console.log("formatDate called with:", dateString);
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM-dd", new Date());
  return format(date, "MMM dd, yyyy");
};

export default function HeroSection() {
  const router = useRouter()

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "2 adults, 0 children, 1 Bedroom",
  })

  // State for UI controls
  const [activeProperty, setActiveProperty] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeField, setActiveField] = useState<string | null>(null)
  const [guestCount, setGuestCount] = useState({ adults: 2, children: 0, bedrooms: 1 })
  const [withPets, setWithPets] = useState(false)

  // Location search states
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)


  const [selectingCheckIn, setSelectingCheckIn] = useState(true)
    // Calendar states - Updated to match SearchBar
    const [checkInDate, setCheckInDate] = useState<string | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<string | null>(null)
  // const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Refs
  const locationDropdownRef = useRef<HTMLDivElement | null>(null)
  const guestDropdownRef = useRef<HTMLDivElement | null>(null)
  const dateDropdownRef = useRef<HTMLDivElement | null>(null)

  // Sample properties for carousel
  const properties = [
    { type: "Mountain Chalets", description: "Cozy retreats with breathtaking views" },
    { type: "Luxury Villas", description: "Exclusive getaways with premium amenities" },
    { type: "Beachfront Cottages", description: "Wake up to the sound of waves" },
    { type: "Countryside Cabins", description: "Peaceful escapes surrounded by nature" },
  ]

  // Popular Indian destinations as fallback
  const popularDestinations = [
    "Shimla",
    "kashmir",
    "Manali",
    "Goa",
    "Ladakh",
    "Kerala",
    "Agra",
    "Varanasi",
    "Mumbai",
    "Jaipur",
    "Udaipur",
    "Rishikesh",
    "Darjeeling",
  ]

  // Rotate through properties
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProperty((prev) => (prev + 1) % properties.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [properties.length])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node) &&
        activeField === "location"
      ) {
        setActiveField(null)
        setShowLocationSuggestions(false)
      }

      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target as Node) &&
        activeField === "guests"
      ) {
        setActiveField(null)
      }

      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node) &&
        (activeField === "checkIn" || activeField === "checkOut")
      ) {
        setActiveField(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeField])

  // Fetch location suggestions from API (India only)
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
      return
    }

    setLoadingSuggestions(true)
    try {
      // Add "India" to the query to filter results
      const response = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query + " India")}&limit=30`,
      )

      const suggestions = response.data.features
        .filter((feature: any) => feature.properties.country === "India" || feature.properties.countrycode === "IN")
        .map((feature: any) => ({
          name: feature.properties.name || feature.properties.city,
          state: feature.properties.state,
          country: feature.properties.country,
          displayName: feature.properties.name || feature.properties.city,
        }))
        .filter((suggestion: any) => suggestion.name) // Remove entries without names
        .slice(0, 6) // Limit to 6 suggestions

      setLocationSuggestions(suggestions)
      setShowLocationSuggestions(suggestions.length > 0)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      // Fallback to popular destinations
      const filteredPopular = popularDestinations
        .filter((dest) => dest.toLowerCase().includes(query.toLowerCase()))
        .map((dest) => ({ name: dest, displayName: dest }))
      setLocationSuggestions(filteredPopular)
      setShowLocationSuggestions(filteredPopular.length > 0)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))

    // Fetch location suggestions when typing in location field
    if (name === "location") {
      fetchLocationSuggestions(value)
    }
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchParams.location.trim()) {
      alert("Please enter a destination to search")
      return
    }

    const urlParams = new URLSearchParams()
    urlParams.set("q", searchParams.location)

    // if (searchParams.checkIn) {
    //   urlParams.set("checkIn", searchParams.checkIn)
    if (checkInDate) {
      urlParams.set("checkIn", checkInDate)
    }

    if (checkOutDate) {
      urlParams.set("checkOut", checkOutDate)
    }

    urlParams.set("adults", guestCount.adults.toString())
    urlParams.set("children", guestCount.children.toString())
    urlParams.set("bedrooms", guestCount.bedrooms.toString())

    if (withPets) {
      urlParams.set("pets", "true")
    }

    router.push(`/detail?${urlParams.toString()}`)
  }

  // Handle guest count changes
  const updateGuestCount = (type: "adults" | "children" | "bedrooms", operation: "add" | "subtract") => {
    setGuestCount((prev) => {
      const newCount = {
        ...prev,
        [type]: operation === "add" ? prev[type] + 1 : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
      }

      setSearchParams((prev) => ({
        ...prev,
        guests: `${newCount.adults} adults, ${newCount.children} children, ${newCount.bedrooms} Bedroom${newCount.bedrooms !== 1 ? "s" : ""}`,
      }))

      return newCount
    })
  }

  // Select a destination
  const selectDestination = (destination: string) => {
    setSearchParams((prev) => ({ ...prev, location: destination }))
    setActiveField(null)
    setShowLocationSuggestions(false)
  }

   // Update searchParams when dates change


  return (
    <section className="hero-container-hero-no1">
      <div className="hero-background-hero-no1">
        <div className="overlay-hero-no1"></div>
        <div className="animated-bg-hero-no1"></div>
        <div className="particles-container-hero-no1">
          {Array.from({ length: 35 }).map((_, index) => (
            <div
              key={index}
              className="particle-hero-no1"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="hero-content-hero-no1">
        <div className="hero-text-container-hero-no1">

          <div className="property-carousel-hero-no1">
            {properties.map((property, index) => (
              <div key={index} className={`property-item-hero-no1 ${index === activeProperty ? "active" : ""}`}>
                <h3>{property.type}</h3>
                <p>{property.description}</p>
              </div>
            ))}
          </div>
            <h1 className="hero-title-hero-no1">Stays with Heart</h1>
            <p className="hero-subtitle-hero-no1">Discover your perfect getaway</p>

          {/* <div className="floating-cottages-hero-no1">
            <div className="cottage-hero-no1 cottage-1-hero-no1"></div>
            <div className="cottage-hero-no1 cottage-2-hero-no1"></div>
            <div className="cottage-hero-no1 cottage-3-hero-no1"></div>
          </div> */}
        </div>

        <div className="search-container-hero-no1">
          <form onSubmit={handleSearch}>
            <h2>Find Your Dream Stay</h2>

            <div className="search-field-container-hero-no1">
              <div
                className={`search-field-hero-no1 ${activeField === "location" ? "active" : ""}`}
                onClick={() => setActiveField("location")}
              >
                <div className="search-field-icon-hero-no1">
                  <MapPin size={18} />
                </div>
                <div className="search-field-content-hero-no1">
                  <label htmlFor="location">Destination</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Where are you going?"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    autoComplete="off"
                    required
                  />
                </div>

                {activeField === "location" && (
                  <div className="search-dropdown-hero-no1 location-dropdown-hero-no1" ref={locationDropdownRef}>
                  
                    <div className="dropdown-content-hero-no1">
                      
                      {showLocationSuggestions && locationSuggestions.length > 0 &&
                        locationSuggestions.map((suggestion: any, index) => (
                          
                          <div
                          key={index}
                          className="dropdown-item-hero-no1"
                          onClick={() => selectDestination(suggestion.displayName)}
                        >
                          <MapPin size={16} />
                          <span>{suggestion.displayName}</span>
                          {suggestion.state && (
                            <span className="location-state-hero-no1">, {suggestion.state}</span>
                          )}
                        </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`search-field-hero-no1 ${activeField === "checkIn" || activeField === "checkOut" ? "active" : ""}`}
                onClick={() => {
                  setActiveField("checkIn")
                  setSelectingCheckIn(true)
                }}
              >
                <div className="search-field-icon-hero-no1">
                <Calendar size={18} />
          </div>





          <div
  className="hero-calendar-wrapper"
  onClick={(e) => {
    e.stopPropagation();
  }}
>         
          <div className="search-field-content-hero-no1"
          onClick={(e) => {
            e.stopPropagation();
          }}>
            <label htmlFor="dates">Dates</label>
            <div className="date-display-hero-no1"
           >
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSelectingCheckIn(true);
                setActiveField("checkIn");
              }}
            >
 
  {checkInDate ? formatDate(checkInDate) : "Check in"}
</span>
<span className="date-separator-hero-no1">→</span>
<span>
  
  {checkOutDate ? formatDate(checkOutDate) : "Check out"}
</span>
</div>

{(activeField === "checkIn" || activeField === "checkOut") && (
  <div className="search-dropdown-hero-no1 date-dropdown-hero-no1" ref={dateDropdownRef}>
    
    <CalendarDropdown
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={(date) => {
        console.log("Setting Check-In Date:", date);
        setCheckInDate(
          (() => {
            if (!date) return null; // or "" if you prefer
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            return d.toISOString().slice(0, 10);
          })()
        );
      }}
      setCheckOutDate={(date) => {
        console.log("Setting Check-Out Date:", date);
        setCheckOutDate(
          (() => {
            if (!date) return null;
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            return d.toISOString().slice(0, 10);
          })()
        );
      }}
      selectingCheckIn={selectingCheckIn}
      setSelectingCheckIn={(value) => {
        console.log("Setting Selecting Check-In:", value);
        setSelectingCheckIn(value);
      }}
      onClose={() => {
        console.log("Closing dropdown");
        setActiveField(null);
      }}
    />
  </div>
)}
          </div>
          </div>

              </div>

              <div
                className={`search-field-hero-no1 ${activeField === "guests" ? "active" : ""}`}
                onClick={() => setActiveField("guests")}
              >
                <div className="search-field-icon-hero-no1">
                  <Users size={18} />
                </div>
                <div className="search-field-content-hero-no1">
                  <label htmlFor="guests">Guests</label>
                  <input
                    type="text"
                    id="guests"
                    name="guests"
                    value={searchParams.guests}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                {activeField === "guests" && (
                  <div className="search-dropdown-hero-no1 guest-dropdown-hero-no1" ref={guestDropdownRef}>
                    <div className="guest-counter-hero-no1">
                      <div className="guest-type-hero-no1">
                        <span>Adults</span>
                        <div className="counter-controls-hero-no1">
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("adults", "subtract")}
                            disabled={guestCount.adults <= 1}
                          >
                            -
                          </button>
                          <span>{guestCount.adults}</span>
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("adults", "add")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="guest-type-hero-no1">
                        <span>Children</span>
                        <div className="counter-controls-hero-no1">
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("children", "subtract")}
                            disabled={guestCount.children <= 0}
                          >
                            -
                          </button>
                          <span>{guestCount.children}</span>
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("children", "add")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="guest-type-hero-no1">
                        <span>Bedrooms</span>
                        <div className="counter-controls-hero-no1">
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("bedrooms", "subtract")}
                            disabled={guestCount.bedrooms <= 1}
                          >
                            -
                          </button>
                          <span>{guestCount.bedrooms}</span>
                          <button
                            type="button"
                            className="counter-btn-hero-no1"
                            onClick={() => updateGuestCount("bedrooms", "add")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* <div className="pets-option-hero-no1">
                        <div className="pets-label-hero-no1">
                          <div>Travelling with pets?</div>
                          <div className="pets-sublabel-hero-no1">Pet-friendly accommodations only</div>
                        </div>
                        <label className="toggle-switch-hero-no1">
                          <input type="checkbox" checked={withPets} onChange={() => setWithPets(!withPets)} />
                          <span className="toggle-slider-hero-no1"></span>
                        </label>
                      </div> */}
                     {/* Done Button */}
                            <div className="guest-dropdown-footer">
                            <button
                                  type="button"
                                  className="done-button-hero-no1"
                                  onMouseDown={() => {
                                    setActiveField(null);
                                    setShowLocationSuggestions(false);
                                  }}
                                >
                                  Done
                                </button>
                              </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="search-button1-hero-no1">
              <Search size={18} />
              <span>SEARCH</span>
            </button>
          </form>
        </div>
      </div>

      <nav className="hero-nav-hero-no1">
        <div className="logo-hero-no1">CozyHomeStays</div>

        <button className="menu-toggle-hero-no1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links-hero-no1 ${isMenuOpen ? "nav-open" : ""}`}>
          {/* <Link href="/list-property">List your property</Link> */}
          <Link href="/listproperty" className="btn-register-hero-no1">
            List your property
          </Link>
          {/* <Link href="/signin" className="btn-signin-hero-no1">
            Sign in
          </Link> */}
        </div>
      </nav>
    </section>
  )
}

// Helper
function toLocalYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
