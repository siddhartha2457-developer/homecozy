"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, Calendar, Users, ChevronDown } from "./list/Icons"
import "./SearchBar.css"
import axios from "axios"

const SearchBar = ({ onSearch, initialLocation = "", autoSearch = false }) => {
  // Initialize with only the initialLocation prop, not URL parameters
  const [location, setLocation] = useState(initialLocation)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false)
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [withPets, setWithPets] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectingCheckIn, setSelectingCheckIn] = useState(true)

  const [results, setResults] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const datePickerRef = useRef(null)
  const guestPickerRef = useRef(null)

  // Only auto-trigger search if explicitly requested and location is provided
  useEffect(() => {
    if (autoSearch && initialLocation && onSearch) {
      console.log("SearchBar: Auto-triggering search with initial location:", initialLocation)
      onSearch(initialLocation)
    }
  }, [autoSearch, initialLocation, onSearch])

  // Update location when initialLocation prop changes
  useEffect(() => {
    setLocation(initialLocation)
  }, [initialLocation])

  // Rest of your existing methods remain the same...
  const formatDate = (date) => {
    if (!date) return "Add date"
    const options = { month: "short", day: "numeric", year: "numeric" }
    return new Date(date).toLocaleDateString("en-US", options)
  }

  const dateRangeText = () => {
    if (!checkInDate && !checkOutDate) return "Select dates"
    if (checkInDate && !checkOutDate) return `${formatDate(checkInDate)} — Select checkout`
    return `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}`
  }

  const guestsText = () => {
    const adultsText = `${adults} ${adults === 1 ? "adult" : "adults"}`
    const childrenText = children > 0 ? ` · ${children} ${children === 1 ? "child" : "children"}` : ""
    const roomsText = ` · ${rooms} ${rooms === 1 ? "room" : "rooms"}`
    return `${adultsText}${childrenText}${roomsText}`
  }

  // Generate calendar days
  const generateCalendarDays = (year, month) => {
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

  const isPastDate = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false
    return date > new Date(checkInDate) && date < new Date(checkOutDate)
  }

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return

    if (selectingCheckIn) {
      setCheckInDate(date.toISOString().split("T")[0])
      setCheckOutDate(null)
      setSelectingCheckIn(false)
    } else {
      if (checkInDate && date < new Date(checkInDate)) {
        setCheckInDate(date.toISOString().split("T")[0])
      } else {
        setCheckOutDate(date.toISOString().split("T")[0])
        setIsDatePickerOpen(false)
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false)
      }
      if (guestPickerRef.current && !guestPickerRef.current.contains(event.target)) {
        setIsGuestPickerOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    if (e) e.preventDefault()

    console.log("SearchBar: Search triggered with location:", location)

    if (onSearch) {
      onSearch(location)
    } else {
      console.error("SearchBar: onSearch callback is not defined.")
    }
  }

  const handleLocationChange = async (e) => {
    const query = e.target.value
    setLocation(query)

    console.log("SearchBar: Location input changed:", query)

    if (query.length < 2) {
      setResults([])
      setShowSuggestions(false)
      return
    }

    try {
      console.log("SearchBar: Fetching location suggestions for query:", query)
      const response = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + " India")}&limit=40`)
      console.log("SearchBar: Location suggestions API response:", response.data)

      const suggestions = response.data.features.map((feature) => ({
        name: feature.properties.name,
        country: feature.properties.country,
      }))
      setResults(suggestions)
      setShowSuggestions(true)
    } catch (error) {
      console.error("SearchBar: Error fetching location suggestions:", error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
  }

  return (
    <form className="search-bar-container" onSubmit={handleSearch}>
      <div className="search-bar">
        <div className="search-input location-input">
          <MapPin className="input-icon" />
          <input
            type="text"
            name="q"
            value={location}
            onChange={handleLocationChange}
            onKeyPress={handleKeyPress}
            placeholder="Search by location"
          />
          {showSuggestions && results.length > 0 && (
            <ul className="suggestions-dropdown">
              {results.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    console.log("SearchBar: Suggestion clicked:", suggestion)
                    setLocation(suggestion.name)
                    setShowSuggestions(false)
                  }}
                >
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="search-input date-input" ref={datePickerRef}>
          <Calendar className="input-icon" />
          <button
            type="button"
            className="date-button"
            onClick={() => {
              console.log("SearchBar: Toggling date picker. Current state:", isDatePickerOpen)
              setIsDatePickerOpen(!isDatePickerOpen)
              setIsGuestPickerOpen(false)
            }}
          >
            {checkInDate && checkOutDate ? `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}` : "Select dates"}
          </button>

          {isDatePickerOpen && (
            <div className="date-picker-dropdown">
              <div className="calendar-header">
                <button type="button" className="calendar-nav" onClick={prevMonth}>
                  &lt;
                </button>
                <h3>{getMonthName(calendarMonth)}</h3>
                <button type="button" className="calendar-nav" onClick={nextMonth}>
                  &gt;
                </button>
              </div>
              <div className="calendar-weekdays">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="calendar-days">
                {generateCalendarDays(calendarMonth.getFullYear(), calendarMonth.getMonth()).map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${!day.day ? "empty" : ""} ${
                      day.date && checkInDate && day.date.toISOString().split("T")[0] === checkInDate ? "check-in" : ""
                    } ${
                      day.date && checkOutDate && day.date.toISOString().split("T")[0] === checkOutDate
                        ? "check-out"
                        : ""
                    } ${day.date && isInRange(day.date) ? "in-range" : ""} ${
                      day.date && isPastDate(day.date) ? "past" : ""
                    }`}
                    onClick={() => day.day && !isPastDate(day.date) && handleDateSelect(day.date)}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
              <div className="calendar-footer">
                <button
                  type="button"
                  className="clear-dates"
                  onClick={(e) => {
                    e.stopPropagation()
                    setCheckInDate(null)
                    setCheckOutDate(null)
                    setSelectingCheckIn(true)
                  }}
                >
                  Clear dates
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="search-input guests-input" ref={guestPickerRef}>
          <Users className="input-icon" />
          <button
            type="button"
            className="guests-button"
            onClick={() => {
              setIsGuestPickerOpen(!isGuestPickerOpen)
              setIsDatePickerOpen(false)
            }}
          >
            {guestsText()}
            <ChevronDown className={`dropdown-arrow ${isGuestPickerOpen ? "open" : ""}`} />
          </button>

          {isGuestPickerOpen && (
            <div className="guests-dropdown">
              <div className="guest-option">
                <div className="guest-type">
                  <div className="guest-label">Adults</div>
                  <div className="guest-sublabel">Ages 13+</div>
                </div>
                <div className="guest-controls">
                  <button
                    type="button"
                    className={`guest-button ${adults <= 1 ? "disabled" : ""}`}
                    onClick={() => adults > 1 && setAdults(adults - 1)}
                    disabled={adults <= 1}
                  >
                    −
                  </button>
                  <span className="guest-count">{adults}</span>
                  <button type="button" className="guest-button" onClick={() => setAdults(adults + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="guest-option">
                <div className="guest-type">
                  <div className="guest-label">Children</div>
                  <div className="guest-sublabel">Ages 0-12</div>
                </div>
                <div className="guest-controls">
                  <button
                    type="button"
                    className={`guest-button ${children <= 0 ? "disabled" : ""}`}
                    onClick={() => children > 0 && setChildren(children - 1)}
                    disabled={children <= 0}
                  >
                    −
                  </button>
                  <span className="guest-count">{children}</span>
                  <button type="button" className="guest-button" onClick={() => setChildren(children + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="guest-option">
                <div className="guest-type">
                  <div className="guest-label">Rooms</div>
                </div>
                <div className="guest-controls">
                  <button
                    type="button"
                    className={`guest-button ${rooms <= 1 ? "disabled" : ""}`}
                    onClick={() => rooms > 1 && setRooms(rooms - 1)}
                    disabled={rooms <= 1}
                  >
                    −
                  </button>
                  <span className="guest-count">{rooms}</span>
                  <button type="button" className="guest-button" onClick={() => setRooms(rooms + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="pets-option">
                <div className="pets-label">
                  <div>Travelling with pets?</div>
                  <div className="pets-sublabel">Pet-friendly accommodations only</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={withPets} onChange={() => setWithPets(!withPets)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <button type="button" className="done-button" onClick={() => setIsGuestPickerOpen(false)}>
                Done
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="search-button">
          <Search className="search-icon" />
          <span>Search</span>
        </button>
      </div>
    </form>
  )
}

export default SearchBar
