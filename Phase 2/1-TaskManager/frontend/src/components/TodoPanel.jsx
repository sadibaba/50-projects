export default function TodoPanel() {
  return (
    <div className="flex-1 p-6 border-l">
      <h2 className="text-xl font-bold mb-4">ToDo Unplanned</h2>
      <input
        type="text"
        placeholder="Press ENTER to add todo"
        className="w-full px-4 py-2 border rounded mb-4"
      />
      <div className="space-y-2">
        <TodoItem label="HI-1" />
        <TodoItem label="HI-1" />
      </div>
      <div className="mt-6 text-sm text-gray-500">
        Todo's: 0 | Scheduled: 0 | Done: 0
      </div>
    </div>
  );
}

function TodoItem({ label }) {
  return (
    <div className="p-3 bg-gray-100 rounded shadow-sm">{label}</div>
  );
}