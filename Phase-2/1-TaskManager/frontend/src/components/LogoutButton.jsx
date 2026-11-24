import { useNavigate } from "react-router-dom";
import { clearSession } from "../api/axios";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-2xl rounded text-gray-600 hover:text-[#76aad4] transition"
      title="Sign out"
      aria-label="Sign out"
    >
      <i className="ri-logout-circle-r-line"></i>
    </button>
  );
}
