import Sidebar from "../components/Sidebar";
import PlannerPanel from "../components/PlannerPanel";
import TodoPanel from "../components/TodoPanel";
import Clock from "../components/Clock";
import ProjectCard from "../components/ProjectCard";
import MusicPlayer from "../components/MusicPlayer";
import UploadBar from "../components/UploadBar";
import LogoutButton from "../components/LogoutButton";


export default function Home() {
  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Sidebar */}
       <div className="p-4">
        <LogoutButton />
      </div>

      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Panel: Planner */}
        <div className="w-1/2 p-6">
          <PlannerPanel />
        </div>

        {/* Right Panel: Todo + Extras */}
        <div className="w-1/2 p-6 space-y-6 border-l">
          <TodoPanel />
          <Clock />
          <ProjectCard />
          <MusicPlayer />
          <UploadBar />
        </div>
      </div>
    </div>
  );
}