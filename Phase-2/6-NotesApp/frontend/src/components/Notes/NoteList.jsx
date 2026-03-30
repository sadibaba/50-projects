import React, { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NoteContext } from '../../context/NoteContext';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import { FiX, FiFileText } from 'react-icons/fi';

const NoteList = ({ limit }) => {
  const { notes, loading, deleteNote } = useContext(NoteContext);
  const [editingNote, setEditingNote] = useState(null);

  const displayedNotes = limit ? notes.slice(0, limit) : notes;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0' }}>
        <span className="loader" style={{ width: '28px', height: '28px', borderWidth: '3px' }} />
      </div>
    );
  }

  if (displayedNotes.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="empty-icon">
          <FiFileText size={22} />
        </div>
        <h3 className="empty-title">No notes yet.</h3>
        <p className="empty-sub">Your thoughts are waiting — create your first note.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="notes-grid">
        <AnimatePresence>
          {displayedNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={(n) => setEditingNote(n)}
              onDelete={deleteNote}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingNote && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingNote(null)}
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
                <h2 className="modal-title">Edit Note</h2>
                <button className="btn-icon" onClick={() => setEditingNote(null)}>
                  <FiX size={16} />
                </button>
              </div>
              <NoteForm
                noteToEdit={editingNote}
                onSuccess={() => setEditingNote(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NoteList;
