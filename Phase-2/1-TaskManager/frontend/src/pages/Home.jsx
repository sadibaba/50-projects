import Sidebar from "../components/Sidebar";
import PlannerPanel from "../components/PlannerPanel";
import TodoPanel from "../components/TodoPanel";
import PlannerTodo from "../components/PlannerTodo";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const [activeFilter, setActiveFilter] = useState("Unplanned");

  return (
    <div className="h-full w-full flex bg-[#d8e3e9]">
      {/* Sidebar */}
      <div className="p-2"></div>
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel: Planner */}
        <div className="w-1/2 p-6">
          <PlannerPanel
            todos={todos}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {/* Right Panel: Todo + Extras */}
        <div className="w-1/2 p-6 space-y-6 bg-[#ccdde7]">
          {activeFilter === "Planned" ? (
            <PlannerTodo
              todos={todos}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          ) : (
            <TodoPanel
              todos={todos}
              setTodos={setTodos}
              activeFilter={activeFilter}
            />
          )}
          <ProjectCard />
        </div>
      </div>
    </div>
  );
}
