import { useCallback, useEffect, useState } from "react";
import * as authApi from "../api/auth.api";

const PAGE_SIZE = 10;

const formatDate = (value) => {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isActive = (value) =>
  value ? Date.now() - new Date(value) < 7 * 86_400_000 : false;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setError("");
      const [usersRes, statsRes] = await Promise.all([
        authApi.getAllUsers({ page, limit: PAGE_SIZE, q: search || undefined }),
        authApi.getAdminStats(),
      ]);
      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load the user list.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = window.setTimeout(fetchData, 250);
    return () => window.clearTimeout(timer);
  }, [fetchData]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDeleteUser = async (user) => {
    if (
      !window.confirm(
        `Delete ${user.name} (${user.email})? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await authApi.deleteUser(user._id);
      setNotice(`${user.name} was deleted.`);
      await fetchData();
      window.setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the user.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin dashboard</h1>
        <p className="text-gray-600 mt-1">
          User accounts and recent activity. Active means signed in during the
          last seven days.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          ["Total users", stats?.totalUsers ?? 0, "bg-indigo-600"],
          ["Administrators", stats?.adminUsers ?? 0, "bg-slate-800"],
          ["Active users", stats?.activeUsers ?? 0, "bg-emerald-600"],
          ["New in 30 days", stats?.newUsers ?? 0, "bg-amber-600"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className={`${color} text-white rounded-2xl p-5 shadow-sm`}
          >
            <p className="text-sm text-white/80">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
          {notice}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search name or email"
                value={search}
                onChange={handleSearch}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Email", "Role", "Status", "Last active", "Joined", ""].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        isActive(user.lastActiveAt)
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isActive(user.lastActiveAt) ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.lastActiveAt)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-sm hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users match this search.
          </div>
        )}

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
            users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={pagination.page <= 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((current) =>
                  Math.min(current + 1, pagination.pages || 1)
                )
              }
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
