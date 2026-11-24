import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { saveSession } from "../api/axios";

export default function AuthForm({ type, formData, setFormData, setToken }) {
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const isLogin = type === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const endpoint = isLogin ? "/users/login" : "/users/register";

    try {
      const { data } = await api.post(endpoint, formData);
      saveSession(data.token, data.user, remember);
      setToken?.(data.token);
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Authentication failed.");
      } else if (err.request) {
        setError("The API is not responding. Check that the backend is running.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c4c4c4] p-4">
      <div className="relative z-10 p-8 bg-[#ecf0f3] shadow-2xl rounded-4xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 text-center text-gray-800">
          {isLogin ? "Sign in" : "Create an account"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {isLogin
            ? "Use your email and password to access your planner."
            : "Start organising tasks and projects in one place."}
        </p>

        {error && (
          <div
            role="alert"
            className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4 text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              autoComplete="name"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-[#ecf0f3] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          )}

          <input
            type="email"
            autoComplete="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-full bg-[#ecf0f3] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <input
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "Password" : "Password (min. 8 characters)"}
            minLength={isLogin ? undefined : 8}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 rounded-full bg-[#f0f0f3] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4"
              />
              <span>Keep me signed in</span>
            </label>
            <Link to="/forgot" className="text-[#555558] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-[#717171] text-white rounded-xl hover:bg-[#575656] transition disabled:opacity-60"
          >
            {submitting ? "Please wait..." : isLogin ? "Sign in" : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          {isLogin ? (
            <>
              No account yet?{" "}
              <Link to="/register" className="text-[#1e1e1f] hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link to="/login" className="text-[#1e1e1f] hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
