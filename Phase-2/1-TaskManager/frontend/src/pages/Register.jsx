// pages/Register.jsx
import { useState } from "react";
import AuthForm from "../components/authForm";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await api.post("/users/register", formData);
    localStorage.setItem("token", res.data.token);
    navigate("/");
  };
  
  return (
    <AuthForm
    type="register"
    onSubmit={handleRegister}
    formData={formData}
    setFormData={setFormData}
    />
  );

}
