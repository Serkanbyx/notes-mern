import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import NoteList from "../components/NoteList";
import NoteModal from "../components/NoteModal";
import ConfirmDialog from "../components/ConfirmDialog";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleTogglePin = async (noteId) => {
    try {
      const { data } = await axiosInstance.patch(`/notes/${noteId}/pin`);
      setNotes((prev) =>
        prev
          .map((n) => (n._id === noteId ? data.note : n))
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }),
      );
      toast.success(data.note.isPinned ? "Note pinned" : "Note unpinned");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle pin");
    }
  };

  const handleDeleteRequest = (noteId) => {
    setDeleteTarget(noteId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/notes/${deleteTarget}`);
      setNotes((prev) => prev.filter((n) => n._id !== deleteTarget));
      toast.success("Note deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleSave = async ({ title, content, color }) => {
    if (editingNote) {
      const { data } = await axiosInstance.put(`/notes/${editingNote._id}`, {
        title,
        content,
        color,
      });
      setNotes((prev) =>
        prev
          .map((n) => (n._id === editingNote._id ? data.note : n))
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }),
      );
      toast.success("Note updated");
    } else {
      const { data } = await axiosInstance.post("/notes", {
        title,
        content,
        color,
      });
      setNotes((prev) =>
        [data.note, ...prev].sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }),
      );
      toast.success("Note created");
    }
  };

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "");

  const filteredNotes = searchQuery
    ? notes.filter((note) => {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          stripHtml(note.content).toLowerCase().includes(query)
        );
      })
    : notes;

  if (loading) return <Spinner size="lg" />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Notes
        </h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <NoteList
        notes={filteredNotes}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onTogglePin={handleTogglePin}
        isSearching={searchQuery.length > 0}
      />

      {/* Floating Action Button */}
      <button
        onClick={openCreateModal}
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-800 active:scale-95"
        aria-label="Create new note"
        title="New Note"
      >
        <PlusIcon />
      </button>

      {/* Create / Edit modal */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        note={editingNote}
        onSave={handleSave}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete note"
        message="This note will be permanently deleted. Are you sure?"
        loading={deleting}
      />
    </main>
  );
};

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default HomePage;
