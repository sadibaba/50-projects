import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); }
  }, [navigate]);

  const stats = [
    { label: 'Posts Published', value: '12' },
    { label: 'Total Likes', value: '245' },
    { label: 'Comments', value: '89' },
    { label: 'Followers', value: '1.2k' },
  ];

  return (
    <div className="min-h-screen bg-primary pt-32 pb-20">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl text-text-primary mb-12"
        >
          Dashboard
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">{stat.label}</p>
              <p className="font-display text-4xl text-text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl text-text-primary mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/home')} className="w-full py-3 bg-accent text-primary rounded-full font-bold hover:bg-amber-300 transition-colors">Go to Home</button>
              <button onClick={() => navigate('/profile')} className="w-full py-3 bg-secondary text-text-primary rounded-full font-medium hover:bg-secondary/80 transition-colors">View Profile</button>
              <button className="w-full py-3 bg-secondary text-text-primary rounded-full font-medium hover:bg-secondary/80 transition-colors">Create New Post</button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="font-display text-2xl text-text-primary mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { text: 'You liked "The Future of AI"', time: '2 hours ago' },
                { text: 'New comment on your post', time: 'Yesterday' },
                { text: 'You published "React Hooks Guide"', time: '3 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-text-primary text-sm">{activity.text}</p>
                    <p className="text-text-secondary text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;