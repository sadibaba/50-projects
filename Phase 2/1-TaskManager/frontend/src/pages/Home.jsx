import Sidebar from "../components/Sidebar";
import PlannerPanel from "../components/PlannerPanel";
import TodoPanel from "../components/TodoPanel";
import ProjectCard from "../components/ProjectCard";



export default function Home() {
  return (
    <div className="h-full w-full flex bg-[#d8e3e9]">
      {/* Sidebar */}
       <div className="p-2">
       
      </div>

      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel: Planner */}
        <div className="w-1/2 p-6">
          <PlannerPanel />
          
        </div>

        {/* Right Panel: Todo + Extras */}
        <div className="w-1/2 p-6 space-y-6 bg-[#ccdde7] ">
          <TodoPanel />
          <ProjectCard />
        </div>
      </div>
    </div>
  );
}