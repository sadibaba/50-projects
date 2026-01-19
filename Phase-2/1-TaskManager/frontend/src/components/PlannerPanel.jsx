import { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';
import Clock from "../components/Clock";
import Calendar from "./Calendar";

export default function PlannerPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const digitalHours = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${digitalHours}${ampm}`;
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex-1  p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Planner</h2>

      <div className="flex items-center justify-between mb-4">
        {/* Filters */}
        <div className="flex flex-col space-y-4 space-x-4">
          <Filter
            label="Unplanned"
            count={2}
            icon="ri-download-2-line"
            active={true}
          />
          <Filter label="Planned" icon="ri-checkbox-circle-line" active={false}/>
          <Filter label="All" icon="ri-stack-line" active={false} />
        </div>

        {/* Dynamic Time */}
        <div className="text-xl text-gray-500">
          🕓 {formattedTime} | {formattedDate}
        </div>
      </div>
 <div className="my-6">
      <Clock />
    </div>
      <Calendar />
    </div>
  );
}

function Filter({ label, count, icon, active }) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-[#d8e3e9] text-gray-800 shadow-inner"
          : "bg-[#f0f0f3] text-gray-600 hover:bg-[#e0e0e5]"
      }`}
    >
      <i className={`${icon} text-lg`}></i>
      <span>{label}</span>
      {count !== undefined && (
        <span className="bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-md">
          {count}
        </span>
      )}
    </button>
  );
}
