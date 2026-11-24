import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Password hashing",
    description:
      "Passwords are hashed with bcrypt before they reach the database. Plain-text passwords are never stored.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
  {
    title: "JWT sessions",
    description:
      "Login issues a signed token that expires after seven days. It can be sent as a bearer token or stored in an HTTP-only cookie.",
    icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  },
  {
    title: "Role-based access",
    description:
      "Every account has a user or admin role. Admin endpoints verify both the session and the role before returning data.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Account management",
    description:
      "Users can update their profile and password. Administrators can search, paginate, inspect activity and remove accounts.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <section className="text-center py-16 px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-4">
          Authentication System
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Authentication with
          <span className="block text-indigo-600">role-based access</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          A complete authentication flow built with React, Express, MongoDB and
          JSON Web Tokens. Register, sign in, manage your account and administer
          users from a protected dashboard.
        </p>

        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Create an account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-indigo-700 bg-white border border-indigo-200 rounded-full hover:bg-indigo-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl">
            <span className="text-base font-medium">
              Signed in as {user.name}
            </span>
            <span className="text-xs uppercase tracking-wide bg-white px-2.5 py-1 rounded-full border border-emerald-200">
              {user.role}
            </span>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d={feature.icon}
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            ["1", "Create an account", "Passwords are validated and hashed with bcrypt."],
            ["2", "Receive a JWT", "The API signs a seven-day token and returns the user record."],
            ["3", "Use protected routes", "The token is verified on every request; admins see the user manager."],
          ].map(([step, title, description]) => (
            <div key={step}>
              <div className="text-indigo-300 text-sm font-semibold mb-2">
                Step {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <section className="text-center pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Try the complete flow
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Sign up with an email address. Set ADMIN_EMAIL in the API
            environment to promote that account to the administrator role.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors"
          >
            Get started
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
