import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Download,
  Globe,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Trash2,
  User,
} from "lucide-react";
import api, { clearSession } from "../api/axios";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  bio: "",
};

const initialPassword = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: "en",
    theme: "system",
    privacy: "private",
  });
  const [password, setPassword] = useState(initialPassword);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/users/stats"),
        ]);
        if (!active) return;
        setUser(profileRes.data);
        setProfile({
          name: profileRes.data.name || "",
          email: profileRes.data.email || "",
          phone: profileRes.data.phone || "",
          location: profileRes.data.location || "",
          website: profileRes.data.website || "",
          bio: profileRes.data.bio || "",
        });
        setSettings((current) => ({ ...current, ...(profileRes.data.settings || {}) }));
        setStats(statsRes.data);
      } catch (error) {
        if (active) {
          setNotice({
            type: "error",
            text:
              error.response?.data?.message ||
              "Could not load your profile. Try signing in again.",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "Not available";
    return new Date(user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [user]);

  const showNotice = (type, text) => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        website: profile.website,
        bio: profile.bio,
      });
      setUser(data);
      showNotice("success", "Profile updated.");
    } catch (error) {
      showNotice("error", error.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/settings", { settings });
      setUser(data);
      showNotice("success", "Preferences saved.");
    } catch (error) {
      showNotice("error", error.response?.data?.message || "Could not save preferences.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      showNotice("error", "The new passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword(initialPassword);
      showNotice("success", "Password changed.");
    } catch (error) {
      showNotice("error", error.response?.data?.message || "Could not change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const [profileRes, statsRes, tasksRes] = await Promise.all([
        api.get("/users/profile"),
        api.get("/users/stats"),
        api.get("/tasks"),
      ]);
      const projects = JSON.parse(localStorage.getItem("projects") || "[]");
      const payload = {
        exportedAt: new Date().toISOString(),
        profile: profileRes.data,
        stats: statsRes.data,
        tasks: tasksRes.data,
        localProjects: projects,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `taskmanager-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showNotice("success", "Your data has been exported.");
    } catch {
      showNotice("error", "Export failed. Check that the API is running.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account and all tasks? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await api.delete("/users/account");
      localStorage.removeItem("projects");
      localStorage.removeItem("todos");
      clearSession();
      navigate("/register");
    } catch (error) {
      showNotice("error", error.response?.data?.message || "Could not delete account.");
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600">{notice?.text || "Profile unavailable."}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "data", label: "Data", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="text-gray-600 mt-1">
              Manage your profile, security and stored data.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className={`mb-6 p-3 rounded-lg text-sm ${
              notice.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{user.name}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Member since {memberSince}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {user.website}
                  </a>
                </div>
              )}
            </div>

            {stats && (
              <dl className="grid grid-cols-2 gap-3 mt-6">
                {[
                  ["Tasks", stats.totalTasks],
                  ["Completed", stats.completedTasks],
                  ["Overdue", stats.overdueTasks],
                  ["Active days", stats.activeDays],
                ].map(([label, value]) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <dt className="text-xs text-gray-500">{label}</dt>
                    <dd className="text-xl font-semibold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <nav className="mt-6 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile information</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This information is stored with your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full name" icon={User}>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </Field>

                  <Field label="Email" icon={Mail}>
                    <input
                      type="email"
                      value={profile.email}
                      readOnly
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </Field>

                  <Field label="Phone" icon={Phone}>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Optional"
                    />
                  </Field>

                  <Field label="Location" icon={MapPin}>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="City, country"
                    />
                  </Field>

                  <Field label="Website" icon={Globe}>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://example.com"
                    />
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    maxLength={500}
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="A short description for your account"
                  />
                  <p className="text-xs text-gray-400 mt-1">{profile.bio.length}/500</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Change password</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Use at least eight characters. Passwords are hashed with bcrypt.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword({ ...password, currentPassword: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword({ ...password, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword({ ...password, confirmPassword: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  {saving ? "Updating..." : "Update password"}
                </button>
              </form>
            )}

            {activeTab === "preferences" && (
              <form onSubmit={handleSettingsSave} className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    These settings are saved to your account.
                  </p>
                </div>

                {[
                  ["emailNotifications", "Email notifications", "Receive account and task reminders by email."],
                  ["pushNotifications", "Push notifications", "Allow browser notifications when requested."],
                ].map(([key, label, hint]) => (
                  <label
                    key={key}
                    className="flex items-start justify-between gap-4 p-4 bg-slate-50 rounded-xl cursor-pointer"
                  >
                    <span>
                      <span className="block font-medium text-gray-800">{label}</span>
                      <span className="block text-sm text-gray-500">{hint}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={Boolean(settings[key])}
                      onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                      className="mt-1 h-5 w-5 accent-blue-600"
                    />
                  </label>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1.5">
                      Theme
                    </span>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1.5">
                      Privacy
                    </span>
                    <select
                      value={settings.privacy}
                      onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save preferences"}
                </button>
              </form>
            )}

            {activeTab === "data" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your data</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Export a copy of your profile, tasks and locally stored projects.
                  </p>
                  <button
                    onClick={handleExport}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4" />
                    Export as JSON
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-red-700">Delete account</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    This permanently removes your account and every task linked to it.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete my account
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      <span className="relative block">
        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        {children}
      </span>
    </label>
  );
}
