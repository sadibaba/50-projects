export default function MusicPlayer() {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <img src="https://via.placeholder.com/40" alt="Album" className="rounded-full" />
        <span className="text-red-500 text-xl">❤️</span>
      </div>
      <p className="text-sm text-gray-700">Track 099 / New...</p>
      <div className="flex justify-between mt-2 text-xl">
        <button>⏮️</button>
        <button>▶️</button>
        <button>⏭️</button>
      </div>
    </div>
  );
}