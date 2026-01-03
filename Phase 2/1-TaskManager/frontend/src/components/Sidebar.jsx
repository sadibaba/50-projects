export default function Sidebar() {
  return (
    <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-6">
      <Icon name="🔔" />
      <Icon name="💬" />
      <Icon name="📅" />
      <Icon name="⚙️" />
    </div>
  );
}

function Icon({ name }) {
  return (
    <div className="text-2xl hover:text-blue-600 cursor-pointer">
      {name}
    </div>
  );
}