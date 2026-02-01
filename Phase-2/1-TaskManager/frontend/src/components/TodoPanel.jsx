import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TodoPanel({ todos, setTodos, activeFilter }) {
  // const [todos, setTodos] = useState(() => {
  //   const saved = localStorage.getItem("todos");
  //   return saved ? JSON.parse(saved) : [];
  // });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

 const addTodo = (e) => {
  if (e.key === "Enter" && input.trim()) {
    setTodos([
      ...todos,
      { label: input.trim(), done: false, category: "unplanned" },
    ]);
    setInput("");
  }
};

  const filteredTodos =
  activeFilter === "All"
    ? todos
    : todos.filter((t) => t.category === activeFilter.toLowerCase());

  const toggleDone = (index) => {
    const updated = [...todos];
    updated[index].done = !updated[index].done;
    setTodos(updated);
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updated = [...todos];
    const [moved] = updated.splice(result.source.index, 1);
    // category change based on droppableId
    moved.category = result.destination.droppableId;
    updated.splice(result.destination.index, 0, moved);
    setTodos(updated);
  };

  return (
    <div className="flex-1 p-6 bg-[#bad1db] rounded-4xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Todo's</h2>

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTodo}
        placeholder="+ Add todo, press ⏎ ENTER to save"
        className="w-full px-4 py-2 mb-4 rounded-xl bg-white shadow-inner text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <TodoList
          title="Unplanned"
          droppableId="unplanned"
          todos={filteredTodos.filter((t) => t.category === "unplanned")}
          todos={todos.filter((t) => t.category === "unplanned")}
          toggleDone={toggleDone}
          deleteTodo={deleteTodo}
        />
        <TodoList
          title="Without Project"
          droppableId="withoutProject"
          todos={todos.filter((t) => t.category === "withoutProject")}
          toggleDone={toggleDone}
          deleteTodo={deleteTodo}
        />
        <TodoList
          title="Scheduled"
          droppableId="scheduled"
          todos={todos.filter((t) => t.category === "scheduled")}
          toggleDone={toggleDone}
          deleteTodo={deleteTodo}
        />
        <TodoList
          title="Done"
          droppableId="done"
          todos={todos.filter((t) => t.category === "done")}
          toggleDone={toggleDone}
          deleteTodo={deleteTodo}
        />
      </DragDropContext>

      <Summary todos={todos} />
    </div>
  );
}

function TodoList({ title, droppableId, todos, toggleDone, deleteTodo }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-12.5 bg-[#ecf0f3] p-2 rounded-xl"
          >
            {todos.map((todo, idx) => (
              <Draggable key={idx} draggableId={`${droppableId}-${idx}`} index={idx}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={() => toggleDone(idx)}
                      onDelete={() => deleteTodo(idx)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-xl shadow text-sm text-gray-700">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        className="h-4 w-4 accent-gray-500"
      />
      <span className={todo.done ? "line-through text-gray-400" : ""}>{todo.label}</span>
      <button onClick={onDelete} className="text-red-500 text-xs ml-auto">
        Delete
      </button>
    </div>
  );
}

function Summary({ todos }) {
  const scheduled = todos.filter((t) => t.category === "scheduled").length;
  const done = todos.filter((t) => t.category === "done" || t.done).length;
  const active = todos.filter((t) => !t.done && t.category !== "done").length;

  const items = [
    { key: "todos", label: "Todo's", count: active },
    { key: "scheduled", label: "Scheduled", count: scheduled },
    { key: "done", label: "Done", count: done },
  ];

  return (
    <div className="mt-6 flex flex-col gap-2 text-sm">
      {items.map(({ key, label, count }) => (
        <div
          key={key}
          className="px-4 py-2 rounded-xl transition cursor-pointer bg-[#f0f0f3] text-gray-600 hover:bg-[#e0e0e5]"
        >
          {label}: {count}
        </div>
      ))}
    </div>
  );
}

