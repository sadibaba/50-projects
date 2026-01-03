export default function PlannerPanel() {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">Planner</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-2">
          <Filter label="Unplanned" count={2} />
          <Filter label="Planned" />
          <Filter label="All" />
        </div>
        <div className="text-sm text-gray-500">🕓 4 PM | Wed, 17 July</div>
      </div>
      <Calendar />
    </div>
  );
}

function Filter({ label, count }) {
  return (
    <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
      {label} {count ? `(${count})` : ""}
    </button>
  );
}

function Calendar() {
  return (
    <div className="bg-white shadow rounded p-4 mt-4">
      <p className="text-gray-700">📅 July 2024 Calendar (17th highlighted)</p>
    </div>
  );
}