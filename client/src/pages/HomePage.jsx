import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import NoteList from "../components/NoteList";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = async (noteId) => {
    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const handleEdit = (note) => {
    // Placeholder — will be wired to NoteModal in Step 7
    console.log("Edit note:", note._id);
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
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />
    </main>
  );
};

export default HomePage;
