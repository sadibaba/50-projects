import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "remixicon/fonts/remixicon.css";

export default function Sidebar() {
  const navigate = useNavigate();
  
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

  const handleIconClick = (iconName) => {
    if (iconName === "ri-user-line") {
      navigate("/profile");
    }
    // Add other icon click handlers if needed
  };

  return (
    <div className="w-20 bg-[#f1faff] shadow-2xl flex flex-col items-center py-6 space-y-6 rounded-r-2xl">
      {icons.map((icon, index) => (
        <div
          key={index}
          className={`text-2xl text-gray-600 hover:text-[#76aad4] cursor-pointer p-2 rounded-lg transition-all ${
            icon.active ? "text-[#454647] bg-blue-50" : "hover:bg-blue-50"
          }`}
          onClick={() => handleIconClick(icon.name)}
          title={icon.name.replace("ri-", "").replace("-line", "").replace(/-/g, " ")}
        >
          <i className={icon.name}></i>
        </div>
      ))}
      <LogoutButton />
    </div>
  );
}