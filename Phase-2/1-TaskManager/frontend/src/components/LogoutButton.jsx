import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-2xl rounded text-gray-600 hover:text-[#76aad4] transition"
    >
     <i class="ri-logout-circle-r-line"></i>
    </button>
  );
}