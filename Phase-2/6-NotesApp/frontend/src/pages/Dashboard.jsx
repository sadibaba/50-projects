import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { NoteContext } from '../context/NoteContext';
import NoteList from '../components/Notes/NoteList';
import TagManager from '../components/Tags/TagManager';
import { FiPlus, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { notes } = useContext(NoteContext);

  const stats = {
    totalNotes: notes.length,
    recentNotes: notes.filter(note => {
      const daysSince = (Date.now() - new Date(note.createdAt)) / (1000 * 3600 * 24);
      return daysSince <= 7;
    }).length,
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-white/70 text-lg">
            Capture your thoughts, organize your ideas.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay:import React, { useContext } from 'react';
            import { motion } from 'framer-motion';
            import { AuthContext } from '../context/AuthContext';
            import { NoteContext } from '../context/NoteContext';
            import NoteList from '../components/Notes/NoteList';
            import TagManager from '../components/Tags/TagManager';
            import { FiTrendingUp, FiCalendar, FiPlus } from 'react-icons/fi';
            import { useNavigate } from 'react-router-dom';
            
            const getGreeting = () => {
              const h = new Date().getHours();
              if (h < 12) return 'Good morning';
              if (h < 17) return 'Good afternoon';
              return 'Good evening';
            };
            
            const getDate = () => {
              return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            };
            
            const Dashboard = () => {
              const { user } = useContext(AuthContext);
              const { notes } = useContext(NoteContext);
              const navigate = useNavigate();
            
              const stats = {
                totalNotes: notes.length,
                recentNotes: notes.filter(note => {
                  const daysSince = (Date.now() - new Date(note.createdAt)) / (1000 * 3600 * 24);
                  return daysSince <= 7;
                }).length,
              };
            
              return (
                <div className="page-wrapper">
                  <div className="container" style={{ paddingTop: '0' }}>
            
                    {/* Welcome Hero */}
                    <div className="welcome-hero fade-up fade-up-1">
                      <div className="welcome-time">{getDate()}</div>
                      <h1 className="welcome-heading">
                        {getGreeting()},<br />
                        <em>{user?.username}.</em>
                      </h1>
                      <p className="welcome-sub">
                        Your ideas deserve a beautiful home. What will you capture today?
                      </p>
                    </div>
            
                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="stat-card"
                      >
                        <div className="stat-label">Total Notes</div>
                        <div className="stat-value">{stats.totalNotes}</div>
                        <FiTrendingUp className="stat-icon" />
                      </motion.div>
            
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="stat-card"
                      >
                        <div className="stat-label">This Week</div>
                        <div className="stat-value">{stats.recentNotes}</div>
                        <FiCalendar className="stat-icon" />
                      </motion.div>
            
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="stat-card"
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                        onClick={() => navigate('/notes')}
                      >
                        <div className="stat-label">Quick Action</div>
                        <button
                          className="btn-primary"
                          style={{ alignSelf: 'flex-start', marginTop: '10px' }}
                        >
                          <FiPlus size={14} />
                          New Note
                        </button>
                      </motion.div>
                    </div>
            
                    {/* Main Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '28px', alignItems: 'start' }}>
            
                      {/* Notes Column */}
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <div className="section-header">
                          <div>
                            <div className="section-eyebrow">Recent Activity</div>
                            <h2 className="section-title">Latest Notes</h2>
                          </div>
                          <button className="btn-ghost" onClick={() => navigate('/notes')}>
                            View All →
                          </button>
                        </div>
                        <NoteList limit={6} />
                      </motion.div>
            
                      {/* Sidebar */}
                      <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sidebar"
                      >
                        <div>
                          <div className="section-eyebrow" style={{ marginBottom: '6px' }}>Organize</div>
                          <h2 className="section-title" style={{ fontSize: '22px', marginBottom: '20px' }}>Tags</h2>
                          <div className="card" style={{ padding: '20px' }}>
                            <TagManager />
                          </div>
                        </div>
                      </motion.div>
            
                    </div>
                  </div>
                </div>
              );
            };
            
            export default Dashboard;
             0.1 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Notes</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalNotes}</p>
              </div>
              <FiTrendingUp className="w-10 h-10 text-white/50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Recent Notes</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.recentNotes}</p>
              </div>
              <FiCalendar className="w-10 h-10 text-white/50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Quick Action</p>
                <button className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:shadow-lg transition-all">
                  <FiPlus className="inline mr-1" /> New Note
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Recent Notes</h2>
              <NoteList limit={5} />
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Tags</h2>
              <TagManager />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;