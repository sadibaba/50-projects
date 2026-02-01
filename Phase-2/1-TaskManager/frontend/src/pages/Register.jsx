import { useState } from "react";
import AuthForm from "../components/authForm";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <AuthForm
      type="register"
      formData={formData}
      setFormData={setFormData}
    />
  );
}