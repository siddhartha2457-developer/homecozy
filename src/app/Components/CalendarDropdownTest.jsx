"use client";

import { useState } from "react";
import CalendarDropdown from "./CalendarDropdown";

export default function CalendarDropdownTest() {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Calendar Dropdown</h1>
      <div style={{ marginBottom: "20px" }}>
        <p>Check-in Date: {checkInDate || "Not selected"}</p>
        <p>Check-out Date: {checkOutDate || "Not selected"}</p>
      </div>
      <CalendarDropdown
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        setCheckInDate={setCheckInDate}
        setCheckOutDate={setCheckOutDate}
        selectingCheckIn={selectingCheckIn}
        setSelectingCheckIn={setSelectingCheckIn}
      />
    </div>
  );
}