import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NoteContext } from '../context/NoteContext';
import NoteList from '../components/Notes/NoteList';
import TagManager from '../components/Tags/TagManager';
import { FiPlus, FiTrendingUp, FiCalendar } from 'react-icons/fi';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
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
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="text-white/60 text-sm mb-2">{getDate()}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.username}! 👋
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
            transition={{ delay: 0.1 }}
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
                <button 
                  onClick={() => navigate('/notes')}
                  className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:shadow-lg transition-all"
                >
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Recent Notes</h2>
                <button 
                  onClick={() => navigate('/notes')}
                  className="text-white/60 hover:text-white text-sm transition-all"
                >
                  View All →
                </button>
              </div>
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