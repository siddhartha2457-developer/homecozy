"use client"

import { useState } from "react"
import { parse, format } from "date-fns"
import "./CalendarDropdown.css"

const CalendarDropdown = ({
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  selectingCheckIn,
  setSelectingCheckIn,
  onClose,
}) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  // Generate calendar days for a given month
  const generateCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, date: null })
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({ day: i, date })
    }

    return days
  }

  // Check if a date is in the past
  const isPastDate = (date) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Check if a date is between check-in and check-out
  const isInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false
    // Only parse if checkInDate and checkOutDate are valid
    const checkIn = checkInDate ? new Date(checkInDate) : null
    const checkOut = checkOutDate ? new Date(checkOutDate) : null
    return checkIn && checkOut && date > checkIn && date < checkOut
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    if (isPastDate(date)) return

    const selectedDateStr = date.toISOString().split("T")[0]

    if (selectingCheckIn) {
      // Selecting check-in date
      setCheckInDate(selectedDateStr)
      setCheckOutDate(null) // Clear check-out when selecting new check-in
      setSelectingCheckIn(false) // Switch to selecting check-out
    } else {
      // Selecting check-out date
      if (checkInDate && date <= new Date(checkInDate)) {
        // If selected date is before or same as check-in, reset and select as new check-in
        setCheckInDate(selectedDateStr)
        setCheckOutDate(null)
        setSelectingCheckIn(false)
      } else {
        // Valid check-out date
        setCheckOutDate(selectedDateStr)
        // Close calendar after both dates are selected
        if (onClose) {
          setTimeout(() => {
            onClose()
            setSelectingCheckIn(true) // Reset for next time
          }, 300)
        }
      }
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = parse(dateString, "yyyy-MM-dd", new Date())
    return format(date, "MMM dd, yyyy")
  }

  // Get month name and year
  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
  }

  // Clear all dates
  const clearDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
    setSelectingCheckIn(true)
  }

  return (
    <div className="calendar-dropdown">
      {/* Date Input Fields */}
      {/* <div className="date-inputs">
        <div
          className={`date-input-field ${selectingCheckIn ? "active" : ""}`}
          onClick={() => setSelectingCheckIn(true)}
        >
          <label>Check-in</label>
          <div className="date-value">{checkInDate ? formatDate(checkInDate) : "Add date"}</div>
        </div>
        <div
          className={`date-input-field ${!selectingCheckIn ? "active" : ""}`}
          onClick={() => setSelectingCheckIn(false)}
        >
          <label>Check-out</label>
          <div className="date-value">{checkOutDate ? formatDate(checkOutDate) : "Add date"}</div>
        </div>
      </div> */}

      {/* Calendar Header */}
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={prevMonth}>
          ←
        </button>
        <h3>{getMonthName(calendarMonth)}</h3>
        <button type="button" className="calendar-nav" onClick={nextMonth}>
          →
        </button>
      </div>

      {/* Weekdays */}
      <div className="calendar-weekdays">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Calendar Days */}
      <div className="calendar-days">
        {generateCalendarDays(calendarMonth.getFullYear(), calendarMonth.getMonth()).map((day, index) => {
          if (!day.day) {
            return <div key={index} className="calendar-day empty"></div>
          }

          const dateStr = day.date.toISOString().split("T")[0]
          const isCheckIn = checkInDate === dateStr
          const isCheckOut = checkOutDate === dateStr
          const isInDateRange = isInRange(day.date)
          const isPast = isPastDate(day.date)

          return (
            <div
              key={index}
              className={`calendar-day ${isPast ? "past" : ""} ${isCheckIn ? "check-in" : ""} ${
                isCheckOut ? "check-out" : ""
              } ${isInDateRange ? "in-range" : ""}`}
              onClick={() => !isPast && handleDateSelect(day.date)}
            >
              {day.day}
            </div>
          )
        })}
      </div>

      {/* Calendar Footer */}
      <div className="calendar-footer">
        <button type="button" className="clear-dates" onClick={clearDates}>
          Clear dates
        </button>
      </div>
    </div>
  )
}

export default CalendarDropdown
