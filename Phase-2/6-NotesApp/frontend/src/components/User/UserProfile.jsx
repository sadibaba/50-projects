import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { NoteContext } from '../../context/NoteContext';
import { FiMail, FiCalendar, FiEdit2, FiFileText, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { notes, tags } = useContext(NoteContext);

  const joinedDate = user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '—';

  const initial = user?.username?.charAt(0).toUpperCase();

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '40px' }}>

        {/* Eyebrow */}
        <div className="section-eyebrow fade-up fade-up-1" style={{ marginBottom: '6px' }}>Account</div>
        <h1 className="section-title fade-up fade-up-2" style={{ fontSize: 'clamp(28px,4vw,44px)', marginBottom: '40px' }}>
          Your Profile
        </h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '36px', marginBottom: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
            <div className="profile-avatar">{initial}</div>
            <div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}>
                {user?.username}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'DM Mono', monospace" }}>
                Member since {joinedDate}
              </p>
            </div>
            <button className="btn-ghost" style={{ marginLeft: 'auto' }}>
              <FiEdit2 size={13} />
              Edit Profile
            </button>
          </div>

          <div className="divider" />

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '0' }}>
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

        {/* Stats + Settings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Activity Stats */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
            style={{ padding: '28px' }}
          >
            <div className="section-eyebrow" style={{ marginBottom: '20px' }}>Activity</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'var(--gold-pale)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)',
                }}>
                  <FiFileText size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Total Notes
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '2px' }}>
                    {notes.length}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  background: 'var(--gold-pale)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)',
                }}>
                  <FiTag size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Tags Created
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '2px' }}>
                    {tags.length}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="card"
            style={{ padding: '28px' }}
          >
            <div className="section-eyebrow" style={{ marginBottom: '20px' }}>Settings</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start', width: '100%', padding: '11px 14px' }}>
                Change Password
              </button>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start', width: '100%', padding: '11px 14px' }}>
                Notification Preferences
              </button>
              <button style={{
                width: '100%',
                padding: '11px 14px',
                background: 'rgba(224,92,92,0.08)',
                border: '1px solid rgba(224,92,92,0.2)',
                borderRadius: 'var(--radius)',
                color: '#e05c5c',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
