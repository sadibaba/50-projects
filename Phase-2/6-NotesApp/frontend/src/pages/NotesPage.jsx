import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteContext } from '../context/NoteContext';
import NoteList from '../components/Notes/NoteList';
import NoteForm from '../components/Notes/NoteForm';
import { FiPlus, FiX } from 'react-icons/fi';

const NotesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { selectedTag, setSelectedTag, tags } = useContext(NoteContext);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div style={{ paddingTop: '40px', paddingBottom: '36px' }}>
          <div className="section-eyebrow fade-up fade-up-1">Your Collection</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '6px' }}>
            <h1 className="section-title fade-up fade-up-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
              My Notes
              {selectedTag && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: '16px',
                  fontSize: '18px',
                  color: 'var(--gold)',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                }}>
                  — {selectedTag}
                  <button
                    onClick={() => setSelectedTag(null)}
                    style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                  >
                    <FiX size={16} />
                  </button>
                </span>
              )}
            </h1>

            <motion.button
              className="btn-primary fade-up fade-up-3"
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiPlus size={14} />
              New Note
            </motion.button>
          </div>
        </div>

        {/* Tag Filter Bar */}
        {tags.length > 0 && (
          <div className="tag-filter-bar fade-up fade-up-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`tag-filter-btn ${!selectedTag ? 'active' : 'inactive'}`}
            >
              All
            </button>
            {tags.map(tag => (
              <button
                key={tag._id}
                onClick={() => setSelectedTag(tag.name)}
                className={`tag-filter-btn ${selectedTag === tag.name ? 'active' : 'inactive'}`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="fade-up fade-up-4">
          <NoteList />
        </div>
      </div>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">New Note</h2>
                <button className="btn-icon" onClick={() => setShowForm(false)}>
                  <FiX size={16} />
                </button>
              </div>
              <NoteForm onSuccess={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesPage;
