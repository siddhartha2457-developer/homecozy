"use client"

import { useState } from "react"
import "./HeroCalendarPicker.css"
import React from "react"

const HeroCalendar = React.memo(
  ({
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    selectingCheckIn,
    setSelectingCheckIn,
    onClose,
  }) => {
    console.log("HeroCalendar rendered with selectingCheckIn:", selectingCheckIn);

    const handleDateSelect = (date) => {
      const selectedDateStr = date.toISOString().split("T")[0];
      if (selectingCheckIn) {
        console.log("Setting Check-In Date:", selectedDateStr);
        setCheckInDate(selectedDateStr);
        setSelectingCheckIn(false); // Switch to check-out selection
      } else {
        console.log("Setting Check-Out Date:", selectedDateStr);
        setCheckOutDate(selectedDateStr);
        onClose(); // Close dropdown after selecting check-out date
      }
    };

    return (
      <div className="calendar-container">
        <div className="calendar-days">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="calendar-day"
              onClick={() => handleDateSelect(new Date(2023, 4, index + 1))}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const HeroCalendarPicker = ({
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  selectingCheckIn,
  setSelectingCheckIn,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generate all days for the calendar grid
  const generateMonthDays = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const totalDaysInMonth = lastDayOfMonth.getDate()
    const firstDayWeekday = firstDayOfMonth.getDay()

    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      calendarDays.push({ dayNumber: null, fullDate: null, isEmpty: true })
    }

    // Add all days of the current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const fullDate = new Date(year, month, day)
      calendarDays.push({
        dayNumber: day,
        fullDate: fullDate,
        isEmpty: false,
      })
    }

    return calendarDays
  }

  // Check if a date is before today
  const isDateInPast = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if a date falls between check-in and check-out
  const isDateInSelectedRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false
    const checkinDate = new Date(checkInDate)
    const checkoutDate = new Date(checkOutDate)
    return date > checkinDate && date < checkoutDate
  }

  // Handle when user clicks on a date
  const handleDateClick = (dateObj) => {
    console.log("Clicked on date:", dateObj);

    if (isDateInPast(dateObj.fullDate) || dateObj.isEmpty) {
      console.log("Date is in the past or empty, ignoring.");
      return;
    }

    const selectedDateString = dateObj.fullDate.toISOString().split("T")[0];

    if (selectingCheckIn) {
      console.log("Selecting Check-In Date:", selectedDateString);
      setCheckInDate(selectedDateString);
      setCheckOutDate(null); // Reset checkout when selecting new checkin
      setSelectingCheckIn(false); // Switch to checkout selection mode
    } else {
      console.log("Selecting Check-Out Date:", selectedDateString);
      const checkinDateObj = new Date(checkInDate);

      if (checkInDate && dateObj.fullDate <= checkinDateObj) {
        console.log("Selected date is before or same as check-in, updating check-in date.");
        setCheckInDate(selectedDateString);
        setCheckOutDate(null);
        setSelectingCheckIn(false);
      } else {
        console.log("Valid checkout date selected:", selectedDateString);
        setCheckOutDate(selectedDateString);
        if (onClose) {
          console.log("Closing calendar after selecting both dates.");
          setTimeout(() => {
            onClose();
            setSelectingCheckIn(true); // Reset for next time
          }, 200);
        }
      }
    }
  }

  // Format date for display in the input fields
  const formatDisplayDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Get formatted month and year for header
  const getMonthYearDisplay = (date) => {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Clear both selected dates
  const clearAllDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
    setSelectingCheckIn(true)
  }

  // Handle clicking on date input tabs
  const handleTabClick = (isCheckInTab) => {
    setSelectingCheckIn(isCheckInTab)
  }

  return (
    <div className="hero-calendar-picker">
      {/* Two Separate Date Buttons */}
      <div className="hero-date-buttons">
        <div
          className={`hero-date-button ${selectingCheckIn ? "hero-button-active" : ""}`}
          onClick={() => handleTabClick(true)}
        >
          <div className="hero-button-content">
            <span className="hero-button-label">CHECK-IN</span>
            <span className="hero-button-value">{checkInDate ? formatDisplayDate(checkInDate) : "Add date"}</span>
          </div>
          <div className="hero-button-icon">📅</div>
        </div>

        <div
          className={`hero-date-button ${!selectingCheckIn ? "hero-button-active" : ""}`}
          onClick={() => handleTabClick(false)}
        >
          <div className="hero-button-content">
            <span className="hero-button-label">CHECKOUT</span>
            <span className="hero-button-value">{checkOutDate ? formatDisplayDate(checkOutDate) : "Add date"}</span>
          </div>
          <div className="hero-button-icon">📅</div>
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="hero-calendar-header">
        <button type="button" className="hero-month-nav" onClick={goToPreviousMonth}>
          ←
        </button>
        <h3 className="hero-month-title">{getMonthYearDisplay(currentMonth)}</h3>
        <button type="button" className="hero-month-nav" onClick={goToNextMonth}>
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="hero-weekday-headers">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Calendar Grid */}
      <div className="hero-calendar-grid">
        {generateMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()).map((dayObj, index) => {
          if (dayObj.isEmpty) {
            return <div key={index} className="hero-calendar-cell hero-empty-cell"></div>
          }

          const dateString = dayObj.fullDate.toISOString().split("T")[0]
          const isCheckinDate = checkInDate === dateString
          const isCheckoutDate = checkOutDate === dateString
          const isInRange = isDateInSelectedRange(dayObj.fullDate)
          const isPastDate = isDateInPast(dayObj.fullDate)

          return (
            <div
              key={index}
              className={`hero-calendar-cell ${isPastDate ? "hero-past-date" : ""} ${
                isCheckinDate ? "hero-checkin-date" : ""
              } ${isCheckoutDate ? "hero-checkout-date" : ""} ${isInRange ? "hero-range-date" : ""}`}
              onClick={() => handleDateClick(dayObj)}
            >
              {dayObj.dayNumber}
            </div>
          )
        })}
      </div>

      {/* Calendar Footer */}
      <div className="hero-calendar-footer">
        <button type="button" className="hero-clear-button" onClick={clearAllDates}>
          Clear dates
        </button>
      </div>
    </div>
  )
}


export default HeroCalendar
