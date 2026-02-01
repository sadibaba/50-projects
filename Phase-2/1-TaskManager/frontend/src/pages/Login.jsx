import { useState } from "react";
import AuthForm from "../components/authForm";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  return (
    <AuthForm
      type="login"
      formData={formData}
      setFormData={setFormData}
    />
  );
}