import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgot";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile"; 
import { useEffect, useState } from "react";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
         <Route path="/forgot" element={<ForgotPassword />} />
         <Route path="/profile" element={<ProfilePage />} />
         <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;