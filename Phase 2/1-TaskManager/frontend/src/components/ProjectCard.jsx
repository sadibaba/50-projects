export default function ProjectCard() {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex items-center justify-between mb-4">
      <div>
        <p className="text-sm text-gray-500">Your last project</p>
        <h2 className="text-lg font-bold text-gray-800">T.029 <span className="text-xs bg-yellow-300 px-2 py-1 rounded">FAV</span></h2>
      </div>
      <div className="flex space-x-2 text-xl">
        <span>🎧</span>
        <span>📋</span>
      </div>
    </div>
  );
}