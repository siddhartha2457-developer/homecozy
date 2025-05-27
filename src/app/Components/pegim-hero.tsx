"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import "./pegim-hero.css"

export default function PegimHero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [searchType, setSearchType] = useState("stays")
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: "",
    travelers: "2 adults, 0 children, 1 Bedroom",
  })

  // Animation for floating balloons
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search params:", { type: searchType, ...searchParams })
    // Handle search functionality
  }

  return (
    <section className="pegim__hero">
      <div className="pegim__background">
        <div className="pegim__overlay"></div>
        <div className="pegim__animated-bg"></div>

        {/* Animated balloons */}
        <div className="pegim__balloon pegim__balloon-1"></div>
        <div className="pegim__balloon pegim__balloon-2"></div>
        <div className="pegim__balloon pegim__balloon-3"></div>
        <div className="pegim__balloon pegim__balloon-4"></div>
        <div className="pegim__balloon pegim__balloon-5"></div>

        {/* Animated clouds */}
        <div className="pegim__cloud pegim__cloud-1"></div>
        <div className="pegim__cloud pegim__cloud-2"></div>
        <div className="pegim__cloud pegim__cloud-3"></div>
      </div>

      <nav className="pegim__navbar">
        <div className="pegim__logo">Pegim.</div>
        <div className="pegim__nav-links">
          <Link href="/" className="pegim__nav-link pegim__nav-link--active">
            Home
          </Link>
          <div className="pegim__nav-dropdown">
            <span className="pegim__nav-link">
              Travelers <span className="pegim__dropdown-arrow">▼</span>
            </span>
          </div>
          <div className="pegim__nav-dropdown">
            <span className="pegim__nav-link">
              Products <span className="pegim__dropdown-arrow">▼</span>
            </span>
          </div>
          <Link href="/support" className="pegim__nav-link">
            Support
          </Link>
        </div>
        <div className="pegim__auth-buttons">
          <Link href="/login" className="pegim__login-btn">
            Login
          </Link>
          <Link href="/register" className="pegim__register-btn">
            Register Now!
          </Link>
        </div>
      </nav>

      <div className="pegim__hero-content">
        <div className="pegim__slider-controls">
          <button className="pegim__slider-arrow pegim__slider-prev" aria-label="Previous slide">
            ←
          </button>
          <button className="pegim__slider-arrow pegim__slider-next" aria-label="Next slide">
            →
          </button>
        </div>

        <div className="pegim__hero-text">
          <h1 className="pegim__hero-title">
            Air, Sleep, <span className="pegim__hero-title-accent">Dream</span>
          </h1>
          <p className="pegim__hero-subtitle">Find and book a great experience.</p>

          <button className="pegim__search-start-btn">Start your Search!</button>

          <div className="pegim__slider-dots">
            {[0, 1, 2, 3].map((index) => (
              <button
                key={index}
                className={`pegim__slider-dot ${activeSlide === index ? "pegim__slider-dot--active" : ""}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="pegim__search-container">
          <div className="pegim__search-tabs">
            <button
              className={`pegim__search-tab ${searchType === "stays" ? "pegim__search-tab--active" : ""}`}
              onClick={() => handleSearchTypeChange("stays")}
            >
              Stays
            </button>
            <button
              className={`pegim__search-tab ${searchType === "flight" ? "pegim__search-tab--active" : ""}`}
              onClick={() => handleSearchTypeChange("flight")}
            >
              Flight
            </button>
            <button
              className={`pegim__search-tab ${searchType === "trains" ? "pegim__search-tab--active" : ""}`}
              onClick={() => handleSearchTypeChange("trains")}
            >
              Trains
            </button>
            <button
              className={`pegim__search-tab ${searchType === "hotels" ? "pegim__search-tab--active" : ""}`}
              onClick={() => handleSearchTypeChange("hotels")}
            >
              Hotels
            </button>
          </div>

          <form className="pegim__search-form" onSubmit={handleSearch}>
            <div className="pegim__search-field">
              <div className="pegim__search-icon">✈</div>
              <div className="pegim__search-input-group">
                <label htmlFor="location" className="pegim__search-label">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="pegim__search-input"
                  placeholder="Where are you going?"
                  value={searchParams.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="pegim__search-field">
              <div className="pegim__search-icon">📅</div>
              <div className="pegim__search-input-group">
                <label htmlFor="checkIn" className="pegim__search-label">
                  Check In
                </label>
                <input
                  type="text"
                  id="checkIn"
                  name="checkIn"
                  className="pegim__search-input"
                  placeholder="Add Date!"
                  value={searchParams.checkIn}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="pegim__search-field">
              <div className="pegim__search-icon">👥</div>
              <div className="pegim__search-input-group">
                <label htmlFor="travelers" className="pegim__search-label">
                  Travelers
                </label>
                <input
                  type="text"
                  id="travelers"
                  name="travelers"
                  className="pegim__search-input"
                  placeholder="Determine the Guests!"
                  value={searchParams.travelers}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="pegim__search-submit-btn">
              Look Forward!
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
