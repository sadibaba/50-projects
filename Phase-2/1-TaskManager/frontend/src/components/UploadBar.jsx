export default function UploadBar() {
  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-xl p-4">
      <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <span>📁</span>
        <span>Upload</span>
      </button>
      <span className="text-xl text-gray-600">🔍</span>
    </div>
  );
}