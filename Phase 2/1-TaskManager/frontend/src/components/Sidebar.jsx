import LogoutButton from "../components/LogoutButton";
import "remixicon/fonts/remixicon.css";

export default function Sidebar() {
  const icons = [
    { name: "ri-calendar-line", active: true },
    { name: "ri-notification-3-line" },
    { name: "ri-bar-chart-line" },
    { name: "ri-user-line" },
    { name: "ri-settings-3-line" },
    { name: "ri-checkbox-line" },
    { name: "ri-chat-3-line" },
    { name: "ri-sun-line" },
    { name: "ri-database-2-line" },
  ];

  return (
    <div className="w-20 bg-[#f1faff] shadow-2xl flex flex-col items-center py-6 space-y-6 rounded-r-2xl">
      {icons.map((icon, index) => (
        <Icon key={index} name={icon.name} active={icon.active} />
      ))}
      <LogoutButton />
    </div>
  );
}

function Icon({ name, active }) {
  return (
    <div
      className={`text-2xl text-gray-600 hover:text-[#76aad4] cursor-pointer ${
        active ? "text-[#454647]" : ""
      }`}
    >
      <i className={name}></i>
    </div>
  );
}