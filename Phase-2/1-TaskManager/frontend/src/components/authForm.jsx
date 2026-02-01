import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AuthForm({ type, formData, setFormData }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = type === "login" ? "/users/login" : "/users/register";

    try {
      const res = await api.post(endpoint, formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response) {
        const msg = err.response.data.message || "Authentication failed.";
        if (msg.toLowerCase().includes("email")) {
          setError("This email is already registered or invalid.");
        } else if (msg.toLowerCase().includes("password")) {
          setError("Incorrect password. Please try again.");
        } else {
          setError(msg);
        }
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
          {type === "login" ? "Sign In" : "Register"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl bg-[#ecf0f3] shadow-inner-top border border-gray-300 focus:outline-none"
              required
            />
          )}

          <input
            type="email"
            placeholder="Username"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] shadow-inner-top border border-gray-300 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 rounded-full bg-[#f0f0f3] shadow-inner-top border border-gray-300 focus:outline-none"
            required
          />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#f0f0f3] shadow-inner-top shadow-2xl"
              />
              <span>Remember me</span>
            </label>
            <a href="/Forgot" className="text-[#555558] hover:underline">
              Forget password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 mb-12 bg-[#717171] text-white rounded-xl hover:bg-[#575656] transition"
          >
            {type === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        {type === "register" ? (
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-[#1e1e1f] hover:underline">
              Login
            </a>
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Don't have any account?{" "}
            <a href="/register" className="text-[#1e1e1f] hover:underline">
              Register
            </a>
          </p>
        )}
      </div>
    </div>
  );
}