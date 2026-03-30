import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

export const NoteContext = createContext();

const API_URL = 'http://localhost:5000/api'; // Direct URL for now

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchTags();
    }
  }, [token, selectedTag]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const url = selectedTag ? `${API_URL}/notes?tag=${selectedTag}` : `${API_URL}/notes`;
      const response = await axios.get(url);
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await axios.post(`${API_URL}/notes`, noteData);
      setNotes([response.data, ...notes]);
      toast.success('Note created! ✨');
      return response.data;
    } catch (error) {
      toast.error('Failed to create note');
      return null;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`${API_URL}/notes/${id}`, noteData);
      setNotes(notes.map(note => note._id === id ? response.data : note));
      toast.success('Note updated! 📝');
      return response.data;
    } catch (error) {
      toast.error('Failed to update note');
      return null;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted 🗑️');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const createTag = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/tags`, { name });
      setTags([...tags, response.data]);
      toast.success(`Tag "${name}" created! 🏷️`);
      return response.data;
    } catch (error) {
      toast.error('Failed to create tag');
      return null;
    }
  };

  const deleteTag = async (id) => {
    try {
      await axios.delete(`${API_URL}/tags/${id}`);
      setTags(tags.filter(tag => tag._id !== id));
      toast.success('Tag deleted');
    } catch (error) {
      toast.error('Failed to delete tag');
    }
  };

  return (
    <NoteContext.Provider value={{
      notes,
      tags,
      loading,
      selectedTag,
      setSelectedTag,
      createNote,
      updateNote,
      deleteNote,
      createTag,
      deleteTag,
      fetchNotes,
      fetchTags,
    }}>
      {children}
    </NoteContext.Provider>
  );
};