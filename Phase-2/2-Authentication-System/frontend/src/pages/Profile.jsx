import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth.api";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const joinedDays = useMemo(() => {
    if (!user?.createdAt) return null;
    return Math.max(
      Math.floor((Date.now() - new Date(user.createdAt)) / 86_400_000),
      0
    );
  }, [user]);

  const isActive = useMemo(() => {
    if (!user?.lastActiveAt) return false;
    return Date.now() - new Date(user.lastActiveAt) < 7 * 86_400_000;
  }, [user]);

  if (!user) return null;

  const openProfileEditor = () => {
    setProfileForm({ name: user.name || "", bio: user.bio || "" });
    setEditing(true);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateProfile(profileForm);
      updateUser(res.data);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Could not update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "The new passwords do not match." });
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ type: "success", text: "Password changed." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Could not change password.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
        <p className="text-gray-600 mt-1">
          Account details, activity and security settings.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                  {user.role === "admin" ? "Administrator" : "User"}
                </span>
              </div>
            </div>
            <button
              onClick={openProfileEditor}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Edit profile
            </button>
          </div>

          {user.bio && (
            <p className="mt-6 text-gray-600 leading-relaxed">{user.bio}</p>
          )}

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Member since
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {formatDate(user.createdAt)}
              </dd>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Days on the platform
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {joinedDays ?? "Not available"}
              </dd>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">
                Last active
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {formatDate(user.lastActiveAt)}
              </dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Account status</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isActive ? "Active in the last 7 days" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Role</span>
                <span className="font-medium text-gray-900">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Password</span>
                <span className="font-medium text-gray-900">
                  Hashed with bcrypt
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
            <button
              onClick={() => setChangingPassword(true)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Change password
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Sessions expire after seven days. Signing out clears the local
              token and the authentication cookie.
            </p>
          </div>
        </aside>
      </div>

      {editing && (
        <Modal title="Edit profile" onClose={() => setEditing(false)}>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Name</span>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Bio</span>
              <textarea
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                rows={4}
                maxLength={300}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="A short description of your account"
              />
              <span className="block text-xs text-gray-400 mt-1">
                {profileForm.bio.length}/300
              </span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {changingPassword && (
        <Modal title="Change password" onClose={() => setChangingPassword(false)}>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            {[
              ["currentPassword", "Current password"],
              ["newPassword", "New password"],
              ["confirmPassword", "Confirm new password"],
            ].map(([field, label]) => (
              <label key={field} className="block">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <input
                  type="password"
                  minLength={field === "currentPassword" ? undefined : 8}
                  autoComplete={
                    field === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  value={passwordForm[field]}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, [field]: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </label>
            ))}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setChangingPassword(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update password"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Profile;
