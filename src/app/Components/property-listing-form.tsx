"use client"

import type React from "react"

import { useState } from "react"
import { Home, MapPin, User, Mail, Phone, Building, Send } from "lucide-react"
import "./property-listing-form.css"

export default function PropertyListingForm() {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    propertyType: "",
    propertyName: "",
    location: "",
    description: "",
    priceRange: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const propertyTypes = ["Villa", "Cottage", "Apartment", "Homestay", "Hotel", "House", "Farmhouse", "Resort"]

  const priceRanges = [
    "₹2,000 - ₹5,000 per night",
    "₹5,000 - ₹10,000 per night",
    "₹10,000 - ₹25,000 per night",
    "₹25,000 - ₹50,000 per night",
    "₹50,000+ per night",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      // Map form data to the expected API format
      const apiData = {
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.location,
        propertyname: formData.propertyName,
        propertytype: formData.propertyType,
        propertypricerange: formData.priceRange,
        message: formData.description || "Interested in listing my property on your platform.",
      }

      // Send data to the external API
      const response = await fetch("https://sampledemo.shop/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: result.message || "Your property listing has been submitted successfully!",
        })
        setIsSubmitted(true)

        // Reset form after showing success message
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            ownerName: "",
            email: "",
            phone: "",
            propertyType: "",
            propertyName: "",
            location: "",
            description: "",
            priceRange: "",
          })
          setSubmitResult(null)
        }, 8000)
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Failed to submit your property listing. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error submitting property listing:", error)
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="listing-form-section">
        <div className="listing-form-background">
          <div className="listing-form-overlay"></div>
        </div>

        <div className="success-container">
          <div className="success-icon">
            <Send size={48} />
          </div>
          <h2>Thank You!</h2>
          <p>
            We have received your property listing request. Our team will contact you within 24 hours to discuss the
            details.
          </p>
          <div className="success-details">
            <p>
              <strong>Property:</strong> {formData.propertyName}
            </p>
            <p>
              <strong>Location:</strong> {formData.location}
            </p>
            <p>A confirmation email has been sent to {formData.email}</p>
          </div>
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="listing-form-section">
      <div className="listing-form-background">
        <div className="listing-form-overlay"></div>
        <div className="animated-villas">
          <div className="villa villa-1"></div>
          <div className="villa villa-2"></div>
          <div className="villa villa-3"></div>
          <div className="villa villa-4"></div>
          <div className="villa villa-5"></div>
        </div>
        <div className="floating-elements">
          {Array.from({ length: 25 }).map((_, index) => (
            <div
              key={index}
              className="floating-dot"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="listing-form-container">
        <div className="form-header">
          <div className="form-icon">
            <Home size={32} />
          </div>
          <h1>List Your Property</h1>
          <p>Join thousands of hosts earning extra income by sharing their beautiful spaces</p>
        </div>

        {submitResult && !isSubmitted && (
          <div className={`submit-message ${submitResult.success ? "success" : "error"}`}>{submitResult.message}</div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ownerName">
                <User size={18} />
                Your Name
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="propertyType">
                <Building size={18} />
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="propertyName">
                <Home size={18} />
                Property Name
              </label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                placeholder="Give your property a catchy name"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="location">
                <MapPin size={18} />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State/Province, Country"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priceRange">
                <span className="price-icon">₹</span>
                Expected Price Range
              </label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleInputChange}
                required
              >
                <option value="">Select price range</option>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="description">Tell us about your property</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what makes your property special..."
                rows={4}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Property</span>
              </>
            )}
          </button>

          <p className="form-note">
            Dont worry about the details now. Our team will contact you to help complete your listing and arrange a
            property visit.
          </p>
        </form>
      </div>
    </section>
  )
}
