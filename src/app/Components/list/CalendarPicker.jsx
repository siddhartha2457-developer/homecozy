// components/CalendarPicker.jsx
import { useState } from "react"
import "./CalendarPicker.css"

const CalendarPicker = ({
  checkInDate,
  checkOutDate,
  onDateSelect,
  onClearDates,
  calendarMonth,
  setCalendarMonth,
  selectingCheckIn,
  setSelectingCheckIn,
}) => {
  const formatDateKey = (date) => date?.toISOString().split("T")[0]

  const getMonthName = (date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" })

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

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
  }

  return (
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
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>

      <div className="calendar-days">
        {generateCalendarDays(calendarMonth.getFullYear(), calendarMonth.getMonth()).map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day.day ? "empty" : ""} 
              ${day.date && formatDateKey(day.date) === checkInDate ? "check-in" : ""}
              ${day.date && formatDateKey(day.date) === checkOutDate ? "check-out" : ""}
              ${day.date && isInRange(day.date) ? "in-range" : ""}
              ${day.date && isPastDate(day.date) ? "past" : ""}`}
            onClick={() => {
              if (day.date && !isPastDate(day.date)) {
                onDateSelect(day.date)
              }
            }}
          >
            {day.day}
          </div>
        ))}
      </div>

      <div className="calendar-footer">
        <button type="button" className="clear-dates" onClick={onClearDates}>
          Clear dates
        </button>
      </div>
    </div>
  )
}

export default CalendarPicker
