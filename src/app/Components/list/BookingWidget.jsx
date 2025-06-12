'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Users, Mail, Phone, User } from './Icons';
import './BookingWidget.css';
import { differenceInCalendarDays, isValid } from 'date-fns';

function BookingWidget({ 
  price, 
  nights, 
  currency, 
  checkInDate, 
  checkOutDate, 
  guestCount, 
  setCheckInDate, 
  setCheckOutDate, 
  setGuestCount, 
  dayWisePrices = {}, 
  occationprice = [] ,
  maxAttendant = {},// Add occasion price as a prop
  singlebeds,
  doublebeds,
  extraGuestCharge,
  Extrabed,
  propertyid

}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [infantCount, setInfantCount] = useState(0);
  const [bedCount, setBedCount] = useState(1);
  const [formStep, setFormStep] = useState(1); // 1: dates & guests, 2: personal info
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [taxes, setTaxes] = useState(0); // Add state for taxes
  const [petsAllowed, setPetsAllowed] = useState("No"); // Default to "No"

  const calendarRef = useRef(null);
  const guestDropdownRef = useRef(null);

  // Calculate the number of days between check-in and check-out
  const dayCount = (() => {
    if (isValid(new Date(checkInDate)) && isValid(new Date(checkOutDate))) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      return differenceInCalendarDays(endDate, startDate);
    }
    return 0;
  })();
    
  // Format dates for display
  const formatDate = (date) => {
    if (!date) return '';
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Generate calendar days
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, date });
    }
    
    return days;
  };

  // Check if a date is in the past
  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if a date is between check-in and check-out
  const isInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    return date > new Date(checkInDate) && date < new Date(checkOutDate);
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;
  
    // Normalize the date to remove timezone offset
    const normalizedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0]; // Format as YYYY-MM-DD
  
    if (selectingCheckIn) {
      setCheckInDate(normalizedDate);
      setCheckOutDate(null);
      setSelectingCheckIn(false);
    } else {
      // Ensure check-out is after check-in
      if (checkInDate && date < new Date(checkInDate)) {
        setCheckInDate(normalizedDate);
      } else {
        setCheckOutDate(normalizedDate);
        setShowCalendar(false);
      }
    }
  };

  // Handle clicks outside calendar and guest dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous/next month
  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      setIsSubmitting(true);
  
      // Prepare the data to send
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkindate: checkInDate,
        checkoutdate: checkOutDate,
        adults: guestCount,
        children: infantCount,
        bedroom: bedCount,
        pets: petsAllowed, // Include pets value
        propertyid: propertyid,
        totalprice: totalPrice,
      };
  
      try {
        // Send the POST request
        const response = await fetch("https://sampledemo.shop/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("Booking successful:", result);
  
          // Show success message
          alert(`Hey ${formData.name}, thanks for booking! Our team will reach out to you soon.`);

  
          // Reset form and state
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
          setCheckInDate(null);
          setCheckOutDate(null);
          setGuestCount(1);
          setInfantCount(0);
          setBedCount(1);
          setFormStep(1);
          setTotalPrice(0);
        } else {
          const error = await response.json();
          console.error("Booking failed:", error);
          alert("Failed to book. Please try again.");
        }
      } catch (error) {
        console.error("Error while booking:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  

  // Handle continue to next step
  const handleContinue = () => {
    if (checkInDate && checkOutDate) {
      setFormStep(2);
    }
  };

  // Handle back to previous step
  const handleBack = () => {
    setFormStep(1);
  };



  const getDateMinusOne = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() +1);
    return d.toISOString().split('T')[0];
  }
  // Check if a date falls within an occasion price range
  const getOccasionPrice = (date) => {
    for (const occasion of occationprice) {
      const startDate = new Date(occasion.startDate);
      const endDate = new Date(occasion.endDate);
      if (date >= startDate && date <= endDate) {
        return occasion.price;
      }
    }
    return null;
  };

  // Add this function to calculate the maximum allowed guests based on beds
  const calculateMaxGuests = () => {
    // console.log("Single beds:", singlebeds);
    // console.log("Double beds:", doublebeds);
    // console.log("Max guests:", singlebeds + doublebeds * 2);
    return singlebeds + doublebeds * 2; // 1 guest per single bed, 2 guests per double bed
    
  };

  // Update the calculateTotalPrice function to include the extra guest charge
  const calculateTotalPrice = (updatedGuestCount = guestCount, updatedBedCount = bedCount) => {
    if (!checkInDate || !checkOutDate) {
      const today = new Date();
      const occasionPrice = getOccasionPrice(today);
      const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
      const dayPrice = dayWisePrices[dayOfWeek] || price;
  
      const defaultPrice = occasionPrice !== null ? occasionPrice : dayPrice;
      const platformFee = defaultPrice * 0.03; // 3% platform fee
      const gstRate = defaultPrice < 7500 ? 0.12 : 0.18; // GST rate based on per-night price
      const gst = defaultPrice * gstRate;
  
      const taxes = platformFee + gst; // Combine GST and Platform Fee as Taxes
      setTotalPrice(defaultPrice + taxes); // Total Price includes Taxes
      setTaxes(taxes); // Store Taxes separately
      return;
    }
  
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    let total = 0;
    let platformFee = 0;
    let gst = 0;
  
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
  
    for (let date = new Date(startDate); date <= adjustedEndDate; date.setDate(date.getDate() + 1)) {
      const occasionPrice = getOccasionPrice(date);
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
      const dayPrice = dayWisePrices[dayOfWeek] || price;
  
      const perNightPrice = occasionPrice !== null ? occasionPrice : dayPrice;
      const perNightGstRate = perNightPrice < 7500 ? 0.12 : 0.18; // GST rate based on per-night price
  
      total += perNightPrice;
      platformFee += perNightPrice * 0.03; // 3% platform fee for each night
      gst += perNightPrice * perNightGstRate; // GST for each night
    }
  
    // Calculate extra guest charge
    const maxGuests = calculateMaxGuests();
    // console.log("max guest" +maxGuests)
    const extraGuests = Math.max(0, (updatedGuestCount || guestCount) - maxGuests);
    // console.log("extra guest" +extraGuests)
    // console.log("extracharge" +extraGuestCharge )
    const extraGuestChargeTotal = extraGuests * extraGuestCharge;
    // console.log("total charge" +extraGuestChargeTotal)
  
    // Calculate extra bed charge
    const extraBedChargeTotal = (updatedBedCount - 1) * Extrabed; // Charge for additional beds beyond 1
    console.log("Extra bed charge:", extraBedChargeTotal);
  
    const taxes = platformFee + gst; // Combine GST and Platform Fee as Taxes
    setTotalPrice(total + taxes + extraGuestChargeTotal + extraBedChargeTotal); // Total Price includes Taxes, Extra Guest Charge, and Extra Bed Charge
    setTaxes(taxes); // Store Taxes separately
  };
  

  // Recalculate total price whenever check-in, check-out, or prices change
  // useEffect(() => {
  //   calculateTotalPrice();
  // }, [checkInDate, checkOutDate, dayWisePrices, occationprice, maxAttendant, singlebeds,
  //   doublebeds, extraGuestCharge, Extrabed]);

  useEffect(() => {
    calculateTotalPrice(guestCount, bedCount);
  }, [checkInDate, checkOutDate, dayWisePrices, occationprice, maxAttendant, singlebeds, doublebeds, extraGuestCharge, Extrabed, bedCount]);

  // Highlight occasion dates in the calendar
  const isOccasionDate = (date) => {
    return getOccasionPrice(date) !== null;
  };
  // console.log (oc)
  return (
    <div className="booking-widget">
      <div className="price-section">
        <div className="price">
          <span className="price-amount">{currency} {Math.round(totalPrice).toLocaleString()}</span>
          <span className="price-nights">
  for {checkInDate && checkOutDate ? nights : 1} night{(checkInDate && checkOutDate ? nights : 1) > 1 ? 's' : ''}
</span>
        </div>
        <div className="price-note">
          <span className="price-tag">Prices include all fees</span>
        </div>
      </div>

      {formStep === 1 ? (
        <div className="booking-form">
          <div className="date-picker-container" ref={calendarRef}>
            <div className="date-picker" onClick={() => setShowCalendar(!showCalendar)}>
              <div className={`check-in ${selectingCheckIn && showCalendar ? 'selecting' : ''}`}>
                <label>CHECK-IN</label>
                <div className="date-input">
                  {checkInDate ? formatDate(checkInDate) : 'Add date'}
                  <Calendar className="date-icon" />
                </div>
              </div>
              <div className={`check-out ${!selectingCheckIn && showCalendar ? 'selecting' : ''}`}>
                <label>CHECKOUT</label>
                <div className="date-input">
                  {checkOutDate ? formatDate(checkOutDate) : 'Add date'}
                  <Calendar className="date-icon" />
                </div>
              </div>
            </div>

            {showCalendar && (
              <div className="calendar-dropdown">
                <div className="calendar-header">
                  <button className="calendar-nav" onClick={prevMonth}>&lt;</button>
                  <h3>{getMonthName(calendarMonth)}</h3>
                  <button className="calendar-nav" onClick={nextMonth}>&gt;</button>
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
                      className={`calendar-day ${!day.day ? 'empty' : ''} ${
                       day.date && checkInDate && getDateMinusOne(day.date) === checkInDate ? 'check-in' : ''

                      } ${
                        // day.date && checkOutDate && day.date.toISOString().split('T')[0] === checkOutDate ? 'check-out' : ''
                         day.date && checkOutDate && getDateMinusOne(day.date) === checkOutDate ? 'check-out' : ''
                      } ${
                        day.date && isInRange(day.date) ? 'in-range' : ''
                      } ${
                        day.date && isPastDate(day.date) ? 'past' : ''
                      } ${
                        day.date && isOccasionDate(day.date) ? 'occasion' : ''
                      }`}
                      onClick={() => day.day && !isPastDate(day.date) && handleDateSelect(day.date)}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
                <div className="calendar-footer">
                  <button 
                    className="clear-dates" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCheckInDate(null);
                      setCheckOutDate(null);
                      setSelectingCheckIn(true);
                    }}
                  >
                    Clear dates
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="guest-selector-container" ref={guestDropdownRef}>
            <div className="guest-selector" onClick={() => setShowGuestDropdown(!showGuestDropdown)}>
              <div>
                <label>GUESTS</label>
                <div className="guest-dropdown">
                  <span>{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
                  <ChevronDown className={`dropdown-arrow ${showGuestDropdown ? 'open' : ''}`} />
                </div>
              </div>
            </div>

            {showGuestDropdown && (
              <div className="guest-dropdown-menu">
                <div className="guest-option">
                  <div className="guest-type">
                    <div className="guest-label">Adults</div>
                    <div className="guest-sublabel">Age 13+</div>
                  </div>
                  <div className="guest-controls">
                    {/* Decrement Button */}
                    <button
                      className={`guest-button ${guestCount <= 1 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        if (guestCount <= 1) return; // Prevent execution if guestCount is already at the minimum
                        e.stopPropagation();
                        setGuestCount((prevGuestCount) => {
                          const newGuestCount = prevGuestCount - 1;
                          console.log("Updated guest count:", newGuestCount);
                          calculateTotalPrice(newGuestCount); // Pass the updated guest count
                          return newGuestCount;
                        });
                      }}
                    >
                      -
                    </button>

                    {/* Display Current Guest Count */}
                    <span className="guest-count">{guestCount}</span>

                    {/* Increment Button */}
                    <button
                      className={`guest-button ${guestCount >= maxAttendant ? 'disabled' : ''}`}
                      onClick={(e) => {
                        if (guestCount >= maxAttendant) return; // Prevent execution if guestCount is already at the maximum
                        e.stopPropagation();
                        setGuestCount((prevGuestCount) => {
                          const newGuestCount = prevGuestCount + 1;
                          console.log("Updated guest count:", newGuestCount);
                          calculateTotalPrice(newGuestCount); // Pass the updated guest count
                          return newGuestCount;
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="guest-option">
                  <div className="guest-type">
                    <div className="guest-label">Children</div>
                    <div className="guest-sublabel"></div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className={`guest-button ${infantCount <= 0 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (infantCount > 0) setInfantCount(infantCount - 1);
                      }}
                    >
                      -
                    </button>
                    <span className="guest-count">{infantCount}</span>
                    <button 
                      className={`guest-button ${infantCount >= 3 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (infantCount < 3) setInfantCount(infantCount + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* <div className="guest-option">
                  <div className="guest-type">
                    <div className="guest-label">Beds</div>
                    <div className="guest-sublabel"></div>
                  </div>
                  <div className="guest-controls">
                    <button 
                      className={`guest-button ${bedCount <= 1 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (bedCount > 1) setBedCount(bedCount - 1);
                      }}
                    >
                      -
                    </button>
                    <span className="guest-count">{bedCount}</span>
                    <button 
                      className={`guest-button ${bedCount >= 10 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (bedCount < 10) setBedCount(bedCount + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div> */}

                {/* <div className="guest-option">
  <div className="guest-type">
    <div className="guest-label">Extra Beds</div>
    <div className="guest-sublabel">Maximum 10 beds</div>
  </div>
  <div className="guest-controls">
   
    <button
      className={`guest-button ${bedCount <= 1 ? 'disabled' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (bedCount > 1) {
          setBedCount((prevBedCount) => {
            const newBedCount = prevBedCount - 1;
            console.log("Updated bed count:", newBedCount);
            calculateTotalPrice(guestCount, newBedCount);
            return newBedCount;
          });
        }
      }}
    >
      -
    </button>

    
    <span className="guest-count">{bedCount}</span>

   
    <button
      className={`guest-button ${bedCount >= 10 ? 'disabled' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (bedCount < 10) {
          setBedCount((prevBedCount) => {
            const newBedCount = prevBedCount + 1;
            console.log("Updated bed count:", newBedCount);
            calculateTotalPrice(guestCount, newBedCount); 
            return newBedCount;
          });
        }
      }}
    >
      +
    </button>
  </div>
</div> */}

                {/* <div className="guest-info">
                  <Users className="guest-info-icon" />
                  <p>This place has a maximum of 16 guests, not including infants.</p>
                </div> */}
                <button 
                  className="close-dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGuestDropdown(false);
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
  {/* <label htmlFor="pets">Travelling with pets?</label> */}
  <div className="pets-option-no">
  <div className="pets-label-no">
    <div className="pets-sublabel-no">Traveling with pets?</div>
  </div>
  <label className="toggle-switch-no">
    <input
      type="checkbox"
      checked={petsAllowed === "Yes"}
      onChange={() => setPetsAllowed(petsAllowed === "Yes" ? "No" : "Yes")}
    />
    <span className="toggle-slider-no"></span>
  </label>
</div>
</div>

          <button 
            className={`reserve-button ${!checkInDate || !checkOutDate ? 'disabled' : ''}`}
            disabled={!checkInDate || !checkOutDate}
            onClick={handleContinue}
          >
            {checkInDate && checkOutDate ? 'Continue to Book' : 'Select dates'}
          </button>
          <p className="charge-note">You won't be charged yet</p>
        </div>
      ) : (
        <div className="booking-form inquiry-form">
          <div className="booking-summary">
            <h3>Your Stay</h3>
            <div className="summary-row">
              <span>Dates</span>
              <span>{formatDate(checkInDate)} - {formatDate(checkOutDate)}</span>
            </div>
            <div className="summary-row">
              <span>Guests</span>
              <span>{guestCount} {guestCount === 1 ? 'guest' : 'guests'}{infantCount > 0 ? `, ${infantCount} ${infantCount === 1 ? 'infant' : 'infants'}` : ''}</span>
            </div>
            <div className="summary-row">
              <span>Bedrooms</span>
              <span>{bedCount}</span>
            </div>
            {/* <div className="summary-row">
              <span>Platform Fee (3%)</span>
              <span>{currency}{(totalPrice * 0.03).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>GST ({price < 7500 ? '12%' : '18%'})</span>
              <span>{currency}{(totalPrice * (price < 7500 ? 0.12 : 0.18)).toFixed(2)}</span>
            </div> */}
            <div className="summary-row">
              <span>Taxes (GST + Platform Fee)</span>
              <span>{currency}{taxes.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{currency} {Math.round(totalPrice).toLocaleString()}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">
                {/* <User className="input-icon" /> */}
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <Mail className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">
                <Phone className="input-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            
            {/* <div className="form-group">
              <label htmlFor="message">Special Requests (optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Any special requests or questions?"
                rows="3"
              ></textarea>
            </div> */}
            
            {/* <div className="form-group">
  <label>Pets Allowed</label>
  <div className="toggle-container">
    <span className={`toggle-option ${petsAllowed === "No" ? "active" : ""}`} onClick={() => setPetsAllowed("No")}>
      No
    </span>
    <span className={`toggle-option ${petsAllowed === "Yes" ? "active" : ""}`} onClick={() => setPetsAllowed("Yes")}>
      Yes
    </span>
  </div>
</div> */}

            {/* <div className="form-group">
  <label htmlFor="pets">Travelling with pets?</label>
  <div className="pets-option-no">
    <div className="pets-label-no">
      <div>Travelling with pets?</div>
      <div className="pets-sublabel-no">Pet-friendly accommodations only</div>
    </div>
    <label className="toggle-switch-no">
      <input
        type="checkbox"
        checked={petsAllowed === "Yes"} // Use petsAllowed state
        onChange={() => setPetsAllowed(petsAllowed === "Yes" ? "No" : "Yes")} // Toggle between "Yes" and "No"
      />
      <span className="toggle-slider-no"></span>
    </label>
  </div>
</div> */}

            <div className="form-buttons">
              <button type="button" className="back-button" onClick={handleBack}>
                Back
              </button>
              <button 
                type="submit" 
                className={`reserve-button ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="button-spinner"></div>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="report-section">
        <button className="report-button">Report this listing</button>
      </div>
    </div>
  );
}

export default BookingWidget;