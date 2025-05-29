"use client";

import { useState } from "react";
import "./CalendarDropdown.css";

const CalendarDropdown = ({
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  selectingCheckIn,
  setSelectingCheckIn,
  onClose,
}) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return;

    const selectedDateStr = date.toISOString().split("T")[0];

    if (selectingCheckIn) {
      setCheckInDate(selectedDateStr);
      setCheckOutDate(null);
      setSelectingCheckIn(false);
    } else {
      if (checkInDate && date < new Date(checkInDate)) {
        setCheckInDate(selectedDateStr);
        setCheckOutDate(null);
        setSelectingCheckIn(false);
      } else {
        setCheckOutDate(selectedDateStr);
        if (onClose) {
          setTimeout(() => {
            onClose();
            setSelectingCheckIn(true);
          }, 300);
        }
      }
    }
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isInRange = (date) => {
    if (!date || !checkInDate || !checkOutDate) return false;
    return date > new Date(checkInDate) && date < new Date(checkOutDate);
  };

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
  };

  const clearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setSelectingCheckIn(true);
  };

  const generateCalendarDays = (year, month) => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get the day of the week for the first day of the month
    const startDay = firstDayOfMonth.getDay();

    // Add empty days for the previous month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, date: null });
    }

    // Add days for the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, date });
    }

    return days;
  };

  return (
    <div className="calendar-dropdown">
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
  );
};

export default CalendarDropdown;
