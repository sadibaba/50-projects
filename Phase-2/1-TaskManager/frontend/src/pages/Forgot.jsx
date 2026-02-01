import { useState } from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });

  return (
    <ForgotPasswordForm
      formData={formData}
      setFormData={setFormData}
    />
  );
}