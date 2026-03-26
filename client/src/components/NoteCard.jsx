const COLOR_MAP = {
  yellow: "#fff9c4",
  green: "#c8e6c9",
  blue: "#bbdefb",
  purple: "#e1bee7",
  pink: "#f8bbd0",
  red: "#ffcdd2",
  orange: "#ffe0b2",
};

const getRelativeTime = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
};

const stripHtml = (html) => html.replace(/<[^>]*>/g, "");

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const bgColor = COLOR_MAP[note.color] || COLOR_MAP.yellow;
  const contentPreview = stripHtml(note.content).slice(0, 150);

  return (
    <article
      style={{ backgroundColor: bgColor }}
      className="group relative flex flex-col gap-3 rounded-xl border border-gray-200/60 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Header: Title + Pin */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 flex-1 text-base font-semibold text-gray-900">
          {note.title}
        </h3>
        <button
          onClick={() => onTogglePin(note._id)}
          className="shrink-0 cursor-pointer rounded-md p-1 text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
          aria-label={note.isPinned ? "Unpin note" : "Pin note"}
          title={note.isPinned ? "Unpin" : "Pin"}
        >
          <PinIcon filled={note.isPinned} />
        </button>
      </div>

      {/* Content preview */}
      {contentPreview && (
        <p className="line-clamp-4 text-sm leading-relaxed text-gray-700">
          {contentPreview}
        </p>
      )}

      {/* Footer: Date + Actions */}
      <div className="mt-auto flex items-center justify-between pt-2">
        <time className="text-xs text-gray-500" dateTime={note.updatedAt}>
          {getRelativeTime(note.updatedAt)}
        </time>

        <div className="flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            onClick={() => onEdit(note)}
            className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
            aria-label="Edit note"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="cursor-pointer rounded-md p-1.5 text-gray-500 transition-colors hover:bg-black/5 hover:text-red-600"
            aria-label="Delete note"
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </article>
  );
};

/* ── Inline SVG Icons ── */

const PinIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4.5 w-4.5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 17v5" />
    <path d="M9 2h6l-1.5 5.5L16 12H8l2.5-4.5z" />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export default NoteCard;
