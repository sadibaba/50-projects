import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { NoteContext } from "../../context/NoteContext";
import {
  FiMail,
  FiCalendar,
  FiEdit2,
  FiFileText,
  FiTag,
  FiLock,
  FiLogOut,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { format } from "date-fns";

const modalStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 60,
};

const boxStyle = {
  background: "var(--ink-soft)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "24px",
  width: "100%",
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const UserProfile = () => {
  const {
    user,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
  } = useContext(AuthContext);
  const { notes, tags } = useContext(NoteContext);

  const [modal, setModal] = useState(null);
  const [username, setUsername] = useState(user?.username || "");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [confirmName, setConfirmName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const joinedDate = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "Not available";
  const initial = user?.username?.charAt(0).toUpperCase();

  const openProfile = () => {
    setUsername(user?.username || "");
    setError("");
    setModal("profile");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const ok = await updateProfile({ username });
    setSaving(false);
    if (ok) setModal(null);
    else setError("That username may already be taken.");
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setSaving(true);
    const ok = await changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    setSaving(false);

    if (ok) {
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setModal(null);
    } else {
      setError("Check your current password and try again.");
    }
  };

  const removeAccount = async () => {
    if (confirmName !== user?.username) {
      setError("Type your username exactly to confirm.");
      return;
    }
    setSaving(true);
    await deleteAccount();
    setSaving(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: "40px" }}>
        <div
          className="section-eyebrow fade-up fade-up-1"
          style={{ marginBottom: "6px" }}
        >
          Account
        </div>
        <h1
          className="section-title fade-up fade-up-2"
          style={{ fontSize: "clamp(28px,4vw,44px)", marginBottom: "40px" }}
        >
          Your Profile
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: "36px", marginBottom: "24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "32px",
              flexWrap: "wrap",
            }}
          >
            <div className="profile-avatar">{initial}</div>
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                {user?.username}
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Member since {joinedDate}
              </p>
            </div>
            <button
              className="btn-ghost"
              style={{ marginLeft: "auto" }}
              onClick={openProfile}
            >
              <FiEdit2 size={13} />
              Edit Profile
            </button>
          </div>

          <div className="divider" />

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            <div className="profile-info-row">
              <FiMail size={14} />
              <span>{user?.email}</span>
            </div>
            <div className="profile-info-row">
              <FiCalendar size={14} />
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ padding: "28px" }}
          >
            <div className="section-eyebrow" style={{ marginBottom: "20px" }}>
              Activity
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Stat icon={FiFileText} label="Total Notes" value={notes.length} />
              <Stat icon={FiTag} label="Tags Created" value={tags.length} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="card"
            style={{ padding: "28px" }}
          >
            <div className="section-eyebrow" style={{ marginBottom: "20px" }}>
              Settings
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                className="btn-ghost"
                style={{ justifyContent: "flex-start", width: "100%", padding: "11px 14px" }}
                onClick={() => {
                  setError("");
                  setModal("password");
                }}
              >
                <FiLock size={13} />
                Change Password
              </button>
              <button
                className="btn-ghost"
                style={{ justifyContent: "flex-start", width: "100%", padding: "11px 14px" }}
                onClick={logout}
              >
                <FiLogOut size={13} />
                Sign Out
              </button>
              <button
                onClick={() => {
                  setError("");
                  setConfirmName("");
                  setModal("delete");
                }}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  background: "rgba(224,92,92,0.08)",
                  border: "1px solid rgba(224,92,92,0.2)",
                  borderRadius: "var(--radius)",
                  color: "#e05c5c",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <FiTrash2 size={13} />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {modal && (
        <div style={modalStyle} onClick={() => setModal(null)}>
          <form
            style={boxStyle}
            onClick={(event) => event.stopPropagation()}
            onSubmit={
              modal === "profile"
                ? saveProfile
                : modal === "password"
                  ? savePassword
                  : (event) => event.preventDefault()
            }
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 className="modal-title" style={{ margin: 0 }}>
                {modal === "profile"
                  ? "Edit profile"
                  : modal === "password"
                    ? "Change password"
                    : "Delete account"}
              </h2>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setModal(null)}
              >
                <FiX size={16} />
              </button>
            </div>

            {error && (
              <p style={{ color: "#e05c5c", fontSize: "13px", margin: 0 }}>
                {error}
              </p>
            )}

            {modal === "profile" && (
              <>
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  minLength={2}
                  maxLength={40}
                  required
                />
                <p style={{ fontSize: "12px", color: "var(--text-faint)", margin: 0 }}>
                  Email changes are not supported in this project.
                </p>
              </>
            )}

            {modal === "password" && (
              <>
                {[
                  ["currentPassword", "Current password"],
                  ["newPassword", "New password (min. 8 characters)"],
                  ["confirmPassword", "Confirm new password"],
                ].map(([field, label]) => (
                  <React.Fragment key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-input"
                      type="password"
                      minLength={field === "currentPassword" ? undefined : 8}
                      value={passwords[field]}
                      onChange={(event) =>
                        setPasswords({
                          ...passwords,
                          [field]: event.target.value,
                        })
                      }
                      required
                    />
                  </React.Fragment>
                ))}
              </>
            )}

            {modal === "delete" && (
              <>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                  This removes your account, notes and tags permanently. Type{" "}
                  <strong>{user?.username}</strong> to confirm.
                </p>
                <input
                  className="form-input"
                  value={confirmName}
                  onChange={(event) => setConfirmName(event.target.value)}
                  placeholder={user?.username}
                />
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                type={modal === "delete" ? "button" : "submit"}
                className="btn-primary"
                onClick={modal === "delete" ? removeAccount : undefined}
                disabled={saving}
              >
                {saving
                  ? "Working..."
                  : modal === "delete"
                    ? "Delete account"
                    : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function Stat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          background: "var(--gold-pale)",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gold)",
        }}
      >
        <Icon size={16} />
      </div>
      <div>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-faint)",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "26px",
            fontWeight: "700",
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginTop: "2px",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
