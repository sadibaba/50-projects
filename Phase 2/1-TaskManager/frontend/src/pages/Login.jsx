// pages/Login.jsx
import { useState } from "react";
import AuthForm from "../components/authForm";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  
const navigate = useNavigate();

// after successful login/register
localStorage.setItem("token", res.data.token);
navigate("/");


  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await api.post("/users/login", formData);
    localStorage.setItem("token", res.data.token);
    alert("Login successful!");
  };

  return <AuthForm type="login" onSubmit={handleLogin} formData={formData} setFormData={setFormData} />;
}