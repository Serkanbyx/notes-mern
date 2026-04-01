import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const sortNotes = (notes) =>
  [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/notes");
      setNotes(data.notes);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(async ({ title, content, color }) => {
    const { data } = await axiosInstance.post("/notes", {
      title,
      content,
      color,
    });
    setNotes((prev) => sortNotes([data.note, ...prev]));
    toast.success("Note created");
  }, []);

  const updateNote = useCallback(async (noteId, { title, content, color }) => {
    const { data } = await axiosInstance.put(`/notes/${noteId}`, {
      title,
      content,
      color,
    });
    setNotes((prev) =>
      sortNotes(prev.map((n) => (n._id === noteId ? data.note : n))),
    );
    toast.success("Note updated");
  }, []);

  const deleteNote = useCallback(async (noteId) => {
    await axiosInstance.delete(`/notes/${noteId}`);
    setNotes((prev) => prev.filter((n) => n._id !== noteId));
    toast.success("Note deleted");
  }, []);

  const togglePin = useCallback(async (noteId) => {
    const { data } = await axiosInstance.patch(`/notes/${noteId}/pin`);
    setNotes((prev) =>
      sortNotes(prev.map((n) => (n._id === noteId ? data.note : n))),
    );
    toast.success(data.note.isPinned ? "Note pinned" : "Note unpinned");
  }, []);

  return { notes, loading, createNote, updateNote, deleteNote, togglePin };
};

export default useNotes;
