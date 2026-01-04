import { useState } from "react";

export default function TodoPanel() {
  const [todos, setTodos] = useState(["HI-1", "HI-1"]);
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="flex-1 p-6  bg-[#d3e2e9] rounded-bl-2xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Todo's</h2>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="+ Add todo, press ⏎ ENTER to save"
        className="w-full px-4 py-2 mb-4 rounded-xl bg-white shadow-inner text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />

      {/* Unplanned Section */}
      <Section title="Unplanned" count={todos.length}>
        {todos.map((label, idx) => (
          <TodoItem key={idx} label={label} />
        ))}
      </Section>

      {/* Without Project */}
      <Section title="Without Project">
        {todos.map((label, idx) => (
          <TodoItem key={`wp-${idx}`} label={label} />
        ))}
      </Section>

      {/* Summary */}
      <Summary />
    </div>
  );
}

function Summary({ active = "todos" }) {
  const items = [
    { key: "todos", label: "Todo's", count: 0 },
    { key: "scheduled", label: "Scheduled", count: 0 },
    { key: "done", label: "Done", count: 0 },
  ];

  return (
    <div className="mt-6 flex flex-col gap-2 text-sm">
      {items.map(({ key, label, count }) => (
        <div
          key={key}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            active === key
              ? "bg-[#d8e3e9] text-gray-800 shadow-inner"
              : "bg-[#f0f0f3] text-gray-600 hover:bg-[#e0e0e5]"
          }`}
        >
          {label}: {count}
        </div>
      ))}
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {count !== undefined && (
          <span className="bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-md">
            {count}
          </span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TodoItem({ label }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-xl shadow text-sm text-gray-700">
      <input type="checkbox" className="h-4 w-4 accent-gray-500" />
      <span>{label}</span>
    </div>
  );
}