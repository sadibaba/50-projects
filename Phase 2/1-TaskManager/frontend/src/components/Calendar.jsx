import { useState } from "react";

export default function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState(2026);

  // Range selection
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const monthIndex = months.indexOf(selectedMonth);
  const totalDays = new Date(selectedYear, monthIndex + 1, 0).getDate();

  let firstDay = new Date(selectedYear, monthIndex, 1).getDay();
  firstDay = (firstDay === 0 ? 6 : firstDay - 1);

  const days = [];
  let week = new Array(7).fill("");
  let dayCounter = 1;

  for (let i = firstDay; i < 7; i++) {
    week[i] = dayCounter++;
  }
  days.push(week);

  while (dayCounter <= totalDays) {
    let newWeek = new Array(7).fill("");
    for (let i = 0; i < 7 && dayCounter <= totalDays; i++) {
      newWeek[i] = dayCounter++;
    }
    days.push(newWeek);
  }

  // Current date (today)
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Handle click selection
  const handleDateClick = (num) => {
    if (!rangeStart) {
      setRangeStart(num);
      setRangeEnd(null);
    } else if (!rangeEnd) {
      if (num < rangeStart) {
        // if clicked before start, swap
        setRangeEnd(rangeStart);
        setRangeStart(num);
      } else {
        setRangeEnd(num);
      }
    } else {
      // reset selection on third click
      setRangeStart(num);
      setRangeEnd(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-4 w-full max-w-md mx-auto">
      {/* Month & Year Selectors */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-[#f0f0f3] text-gray-800 px-3 py-1 rounded shadow-inner"
        >
          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-[#f0f0f3] text-gray-800 px-3 py-1 rounded shadow-inner"
        >
          {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-sm text-gray-500 font-medium">
        {weekdays.map((day) => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.flat().map((date, idx) => {
          const num = Number(date);
          if (!num) return <div key={idx}></div>;

          // check if date is in selected range
          const inRange =
            rangeStart &&
            rangeEnd &&
            num >= rangeStart &&
            num <= rangeEnd;

          // check if date is expired (past today)
          const isExpired =
            selectedYear < todayYear ||
            (selectedYear === todayYear && monthIndex < todayMonth) ||
            (selectedYear === todayYear &&
              monthIndex === todayMonth &&
              num < todayDay);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(num)}
              className={`h-8 w-8 flex items-center justify-center rounded cursor-pointer ${
                inRange && !isExpired
                  ? "bg-[#717171] text-white font-semibold"
                  : "text-gray-700 hover:bg-[#9f9fa1]"
              }`}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
}