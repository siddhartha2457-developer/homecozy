"use client";

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users, Menu, X, Search, ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import "./hero-section.css"

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

  // Calendar states
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectingCheckIn, setSelectingCheckIn] = useState(true)

  // Refs for dropdowns
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
  }, [])

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

    if (searchParams.checkIn) {
      urlParams.set("checkIn", searchParams.checkIn)
    }

    if (searchParams.checkOut) {
      urlParams.set("checkOut", searchParams.checkOut)
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

  // Calendar functions
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({ day: i, date })
    }

    return days
  }

  const isPastDate = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isInRange = (date: Date | null) => {
    if (!date || !searchParams.checkIn || !searchParams.checkOut) return false
    const checkIn = new Date(searchParams.checkIn)
    const checkOut = new Date(searchParams.checkOut)
    return date > checkIn && date < checkOut
  }

  const handleDateSelect = (date: Date) => {
    if (isPastDate(date)) return

    if (selectingCheckIn) {
      setSearchParams((prev) => ({ ...prev, checkIn: date.toISOString().split("T")[0], checkOut: "" }))
      setSelectingCheckIn(false)
    } else {
      if (searchParams.checkIn && date < new Date(searchParams.checkIn)) {
        setSearchParams((prev) => ({ ...prev, checkIn: date.toISOString().split("T")[0], checkOut: "" }))
      } else {
        setSearchParams((prev) => ({ ...prev, checkOut: date.toISOString().split("T")[0] }))
        setActiveField(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
  }

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
          <h1 className="hero-title-hero-no1">CozyHomeStays</h1>
          <p className="hero-subtitle-hero-no1">Discover your perfect getaway</p>

          <div className="property-carousel-hero-no1">
            {properties.map((property, index) => (
              <div key={index} className={`property-item-hero-no1 ${index === activeProperty ? "active" : ""}`}>
                <h3>{property.type}</h3>
                <p>{property.description}</p>
              </div>
            ))}
          </div>

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
                <div className="search-field-content-hero-no1">
                  <label htmlFor="dates">Dates</label>
                  <div className="date-display-hero-no1">
                    <span>{searchParams.checkIn ? formatDate(searchParams.checkIn) : "Check in"}</span>
                    <span className="date-separator-hero-no1">→</span>
                    <span>{searchParams.checkOut ? formatDate(searchParams.checkOut) : "Check out"}</span>
                  </div>
                </div>

                {(activeField === "checkIn" || activeField === "checkOut") && (
                  <div className="search-dropdown-hero-no1 date-dropdown-hero-no1" ref={dateDropdownRef}>
                    <div className="calendar-header-hero-no1">
                      <button type="button" className="calendar-nav-hero-no1" onClick={prevMonth}>
                        <ChevronLeft size={20} />
                      </button>
                      <h3 className="calendar-month-hero-no1">{getMonthName(calendarMonth)}</h3>
                      <button type="button" className="calendar-nav-hero-no1" onClick={nextMonth}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="calendar-weekdays-hero-no1">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <div key={day} className="weekday-hero-no1">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="calendar-days-hero-no1">
                      {generateCalendarDays(calendarMonth.getFullYear(), calendarMonth.getMonth()).map((day, index) => (
                        <div
                          key={index}
                          className={`calendar-day-hero-no1 ${!day.day ? "empty" : ""} ${
                            day.date &&
                            searchParams.checkIn &&
                            day.date.toISOString().split("T")[0] === searchParams.checkIn
                              ? "check-in"
                              : ""
                          } ${
                            day.date &&
                            searchParams.checkOut &&
                            day.date.toISOString().split("T")[0] === searchParams.checkOut
                              ? "check-out"
                              : ""
                          } ${day.date && isInRange(day.date) ? "in-range" : ""} ${
                            day.date && isPastDate(day.date) ? "past" : ""
                          }`}
                          onClick={() => day.day && !isPastDate(day.date) && handleDateSelect(day.date!)}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                    <div className="calendar-footer-hero-no1">
                      <button
                        type="button"
                        className="clear-dates-hero-no1"
                        onClick={() => {
                          setSearchParams((prev) => ({ ...prev, checkIn: "", checkOut: "" }))
                          setSelectingCheckIn(true)
                        }}
                      >
                        Clear dates
                      </button>
                    </div>
                  </div>
                )}
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

                      <div className="pets-option-hero-no1">
                        <div className="pets-label-hero-no1">
                          <div>Travelling with pets?</div>
                          <div className="pets-sublabel-hero-no1">Pet-friendly accommodations only</div>
                        </div>
                        <label className="toggle-switch-hero-no1">
                          <input type="checkbox" checked={withPets} onChange={() => setWithPets(!withPets)} />
                          <span className="toggle-slider-hero-no1"></span>
                        </label>
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

        {/* <button className="menu-toggle-hero-no1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}

        {/* <div className={`nav-links-hero-no1 ${isMenuOpen ? "nav-open" : ""}`}>
          <Link href="/list-property">List your property</Link>
          <Link href="/register" className="btn-register-hero-no1">
            Register
          </Link>
          <Link href="/signin" className="btn-signin-hero-no1">
            Sign in
          </Link>
        </div> */}
      </nav>
    </section>
  )
}
