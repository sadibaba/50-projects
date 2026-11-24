import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPasswordForm({ formData, setFormData }) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setSubmitting(true);

    try {
      const { data } = await api.post("/users/forgot-password", formData);
      setMessage(data.message);
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not start the password recovery flow."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4c4c4] p-4">
      <div className="relative z-10 p-8 bg-[#ecf0f3] shadow-2xl rounded-4xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center text-gray-800">
          Recover password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the email address linked to your account.
        </p>

        {error && (
          <div role="alert" className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 text-center">
            {message}
          </div>
        )}
        {resetUrl && (
          <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded mb-4">
            <p className="font-medium mb-1">Development mode</p>
            <p className="mb-2">
              No mail provider is configured, so the reset link is shown here.
            </p>
            <a href={resetUrl} className="underline break-all">
              Open password reset link
            </a>
          </div>
        )}

        <form onSubmit={handleRecover} className="space-y-4">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ email: e.target.value })}
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-[#717171] text-white rounded-xl hover:bg-[#575656] transition disabled:opacity-60"
          >
            {submitting ? "Generating..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          <Link to="/login" className="text-[#1e1e1f] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
