import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/users/reset-password", { token, password });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "The reset link is invalid or expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4c4c4] p-4">
      <div className="p-8 bg-[#ecf0f3] shadow-2xl rounded-4xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center text-gray-800">
          Choose a new password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          This link can be used once and expires after 15 minutes.
        </p>

        {error && (
          <div role="alert" className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] border border-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-[#717171] text-white rounded-xl hover:bg-[#575656] transition disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update password"}
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
