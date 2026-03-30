import React, { useState, useContext, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NoteContext } from '../../context/NoteContext';
import Select from 'react-select';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'var(--glass)',
    borderColor: state.isFocused ? 'var(--gold)' : 'var(--border-soft)',
    boxShadow: state.isFocused ? '0 0 0 3px var(--gold-pale)' : 'none',
    borderRadius: '4px',
    color: 'var(--text-primary)',
    minHeight: '42px',
    cursor: 'text',
    '&:hover': { borderColor: 'var(--border)' },
  }),
  menu: (base) => ({
    ...base,
    background: 'var(--ink-soft)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--glass-hover)' : 'transparent',
    color: state.isFocused ? 'var(--text-primary)' : 'var(--text-muted)',
    fontSize: '13.5px',
    cursor: 'pointer',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--gold-pale)',
    borderRadius: '2px',
    border: '1px solid rgba(201,168,76,0.25)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--gold-light)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'DM Mono', monospace",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'var(--gold)',
    cursor: 'pointer',
    '&:hover': { background: 'rgba(201,168,76,0.2)', color: 'var(--gold-light)' },
  }),
  input: (base) => ({
    ...base,
    color: 'var(--text-primary)',
    fontSize: '13.5px',
  }),
  placeholder: (base) => ({
    ...base,
    color: 'var(--text-faint)',
    fontSize: '13.5px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    color: 'var(--text-faint)',
    '&:hover': { color: 'var(--text-muted)' },
  }),
};

const NoteForm = ({ noteToEdit, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createNote, updateNote, tags, createTag } = useContext(NoteContext);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setSelectedTags(noteToEdit.tags.map(tag => ({ value: tag._id, label: tag.name })));
    }
  }, [noteToEdit]);

  const tagOptions = tags.map(tag => ({ value: tag._id, label: tag.name }));

  const handleCreateTag = async (inputValue) => {
    const newTag = await createTag(inputValue);
    if (newTag) {
      const opt = { value: newTag._id, label: newTag.name };
      setSelectedTags(prev => [...prev, opt]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    const noteData = {
      title,
      content,
      tags: selectedTags.map(tag => tag.value),
    };
    const result = noteToEdit
      ? await updateNote(noteToEdit._id, noteData)
      : await createNote(noteData);

    setLoading(false);
    if (result && onSuccess) {
      onSuccess();
      if (!noteToEdit) {
        setTitle('');
        setContent('');
        setSelectedTags([]);
      }
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div className="form-field">
        <label className="form-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '14px' }}
          placeholder="Give your note a title..."
          required
        />
      </div>

      {/* Content */}
      <div className="form-field">
        <label className="form-label">Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Write your note content here..."
        />
      </div>

      {/* Tags */}
      <div className="form-field">
        <label className="form-label">Tags</label>
        <Select
          isMulti
          options={tagOptions}
          value={selectedTags}
          onChange={setSelectedTags}
          onCreateOption={handleCreateTag}
          placeholder="Add or create tags..."
          styles={selectStyles}
          noOptionsMessage={() => 'Type to create a tag'}
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ justifyContent: 'center', padding: '13px', marginTop: '4px' }}
        whileHover={{ scale: loading ? 1 : 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? <span className="loader" /> : (noteToEdit ? 'Save Changes' : 'Create Note')}
      </motion.button>
    </form>
  );
};

export default NoteForm;
