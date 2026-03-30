import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import TagChip from '../Tags/TagChip';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="note-card"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 className="note-card-title" style={{ flex: 1, paddingRight: '12px' }}>
          {note.title}
        </h3>
        <div className="note-card-actions" style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            className="btn-icon"
            title="Edit"
            onClick={(e) => { e.stopPropagation(); onEdit(note); }}
          >
            <FiEdit2 size={13} />
          </button>
          <button
            className="btn-icon danger"
            title="Delete"
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <p className="note-card-body">
        {note.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        {note.content.replace(/<[^>]*>/g, '').length > 160 && '…'}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {note.tags.map(tag => (
            <TagChip key={tag._id} tag={tag} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="note-card-footer">
        <span className="note-timestamp">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
};

export default NoteCard;
