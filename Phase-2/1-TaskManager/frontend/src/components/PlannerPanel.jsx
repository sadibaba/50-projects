// import { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';
import Clock from "../components/Clock";
import Calendar from "./Calendar";


export default function PlannerPanel({ todos, activeFilter, setActiveFilter }) {
  const unplannedCount = todos.filter((t) => t.category === "unplanned").length;
  const plannedCount = todos.filter((t) => t.category === "scheduled").length;
  const allCount = todos.length;

  const filters = [
    { label: "Unplanned", icon: "ri-download-2-line", count: unplannedCount },
    { label: "Planned", icon: "ri-checkbox-circle-line", count: plannedCount },
    { label: "All", icon: "ri-stack-line", count: allCount },
  ];

  const time = new Date();
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
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Planner</h2>

      <div className="flex items-center justify-between mb-4">
        {/* Filters */}
        <div className="flex flex-col space-y-4">
          {filters.map((f) => (
            <Filter
              key={f.label}
              label={f.label}
              icon={f.icon}
              count={f.count}
              active={activeFilter === f.label}
              onClick={() => setActiveFilter(f.label)}
            />
          ))}
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

function Filter({ label, count, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
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