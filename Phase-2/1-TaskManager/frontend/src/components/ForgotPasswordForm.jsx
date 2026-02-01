import { useState } from "react";
import api from "../api/axios";

export default function ForgotPasswordForm({ formData, setFormData }) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/users/forgot-password", formData);
      setMessage(res.data.message || "Recovery email sent successfully!");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to send recovery email.");
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4c4c4] relative">
      <div className="relative z-10 p-8 bg-[#ecf0f3] shadow-2xl rounded-4xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Recover Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleRecover} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] shadow-inner-top border border-gray-300 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full py-2 mb-12 bg-[#717171] text-white rounded-xl hover:bg-[#575656] transition"
          >
            Send Recovery Link
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-[#1e1e1f] hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}