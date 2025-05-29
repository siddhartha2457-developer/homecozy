"use client"

import { useState } from "react"
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
    if (isPastDate(date)) return;
  
    const selectedDateStr = date.toISOString().split("T")[0];
  
    if (selectingCheckIn) {
      setCheckInDate(selectedDateStr);
      setCheckOutDate(null); // reset checkout
      setSelectingCheckIn(false); // switch to checkout mode
    } else {
      if (checkInDate && date < new Date(checkInDate)) {
        // If checkout is before checkin, treat this as new check-in
        setCheckInDate(selectedDateStr);
        setCheckOutDate(null);
        setSelectingCheckIn(false); // switch to checkout again
      } else {
        setCheckOutDate(selectedDateStr);
  
        // Auto-close calendar if both dates are selected
        if (onClose && checkInDate) {
          setTimeout(() => {
            onClose();
            setSelectingCheckIn(true); // reset to check-in mode for next time
          }, 300);
        }
      }
    }
  };

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" })
  }

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
  }

  const clearDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
    setSelectingCheckIn(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="calendar-dropdown">
      {/* Date Input Fields */}
      <div className="date-inputs">
              <div
          className={`date-input-field ${selectingCheckIn ? "active" : ""}`}
          onClick={() => {
            setSelectingCheckIn(true);
            setActiveField("calendar"); // <- this ensures the dropdown shows
          }}
        >
          <label>Check-in</label>
          <div className="date-value">{checkInDate ? formatDate(checkInDate) : "Add date"}</div>
        </div>

        <div
          className={`date-input-field ${!selectingCheckIn ? "active" : ""}`}
          onClick={() => {
            if (checkInDate) {
              setSelectingCheckIn(false);
              setActiveField("calendar"); // <- again, show the dropdown
            }
          }}
        >
          <label>Check-out</label>
          <div className="date-value">{checkOutDate ? formatDate(checkOutDate) : "Add date"}</div>
        </div>
      </div>

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
              day.date && checkOutDate && day.date.toISOString().split("T")[0] === checkOutDate ? "check-out" : ""
            } ${day.date && isInRange(day.date) ? "in-range" : ""} ${day.date && isPastDate(day.date) ? "past" : ""}`}
            onClick={() => day.day && !isPastDate(day.date) && handleDateSelect(day.date)}
          >
            {day.day}
          </div>
        ))}
      </div>

      <div className="calendar-footer">
        <button type="button" className="clear-dates" onClick={clearDates}>
          Clear dates
        </button>
      </div>
    </div>
  )
}

export default CalendarDropdown
