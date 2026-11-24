import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

export const NoteContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchNotes = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notes`, {
        params: selectedTag ? { tag: selectedTag } : {},
      });
      setNotes(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, [token, selectedTag]);

  const fetchTags = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchNotes();
      fetchTags();
    } else {
      setNotes([]);
      setTags([]);
    }
  }, [token, fetchNotes, fetchTags]);

  const createNote = async (noteData) => {
    try {
      const response = await axios.post(`${API_URL}/notes`, noteData);
      setNotes((current) => [response.data, ...current]);
      toast.success("Note created");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
      return null;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`${API_URL}/notes/${id}`, noteData);
      setNotes((current) =>
        current.map((note) => (note._id === id ? response.data : note))
      );
      toast.success("Note updated");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update note");
      return null;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes((current) => current.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const createTag = async (name) => {
    try {
      const response = await axios.post(`${API_URL}/tags`, { name });
      setTags((current) => [...current, response.data]);
      toast.success(`Tag "${name}" created`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tag");
      return null;
    }
  };

  const deleteTag = async (id) => {
    try {
      await axios.delete(`${API_URL}/tags/${id}`);
      setTags((current) => current.filter((tag) => tag._id !== id));
      await fetchNotes();
      toast.success("Tag deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete tag");
    }
  };

  return (
    <NoteContext.Provider
      value={{
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
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
