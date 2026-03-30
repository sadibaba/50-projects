import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoteContext } from '../../context/NoteContext';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TagManager = () => {
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const { tags, createTag, deleteTag } = useContext(NoteContext);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.error('Enter a tag name');
      return;
    }
    setLoading(true);
    await createTag(newTagName.trim());
    setNewTagName('');
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Input */}
      <form onSubmit={handleCreateTag} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag..."
          className="form-input"
          style={{ paddingLeft: '12px', flex: 1 }}
        />
        <motion.button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ padding: '0 14px', flexShrink: 0 }}
          whileTap={{ scale: 0.96 }}
        >
          {loading ? <span className="loader" style={{ width: '14px', height: '14px', borderWidth: '2px' }} /> : <FiPlus size={15} />}
        </motion.button>
      </form>

      {/* Tag list */}
      {tags.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--text-faint)', fontFamily: "'DM Mono', monospace", textAlign: 'center', padding: '16px 0' }}>
          No tags yet
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: index * 0.03 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-soft)',
                  background: 'var(--glass)',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiTag size={11} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: "'DM Mono', monospace",
                    color: 'var(--text-muted)',
                  }}>
                    {tag.name}
                  </span>
                </div>
                <button
                  className="btn-icon danger"
                  onClick={() => deleteTag(tag._id)}
                  style={{ width: '24px', height: '24px' }}
                >
                  <FiTrash2 size={11} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TagManager;
