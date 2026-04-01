import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteList from "../components/NoteList";

const mockNotes = [
  {
    _id: "1",
    title: "First Note",
    content: "<p>Hello world</p>",
    color: "yellow",
    isPinned: false,
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Second Note",
    content: "<p>Goodbye world</p>",
    color: "blue",
    isPinned: true,
    updatedAt: new Date().toISOString(),
  },
];

const noop = () => {};

describe("NoteList", () => {
  it("renders all notes", () => {
    render(
      <NoteList
        notes={mockNotes}
        onEdit={noop}
        onDelete={noop}
        onTogglePin={noop}
        isSearching={false}
      />,
    );

    expect(screen.getByText("First Note")).toBeInTheDocument();
    expect(screen.getByText("Second Note")).toBeInTheDocument();
  });

  it("shows empty state when no notes and not searching", () => {
    render(
      <NoteList
        notes={[]}
        onEdit={noop}
        onDelete={noop}
        onTogglePin={noop}
        isSearching={false}
      />,
    );

    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    expect(
      screen.getByText(/Create your first note/),
    ).toBeInTheDocument();
  });

  it("shows search empty state when no results found", () => {
    render(
      <NoteList
        notes={[]}
        onEdit={noop}
        onDelete={noop}
        onTogglePin={noop}
        isSearching={true}
      />,
    );

    expect(screen.getByText("No notes found")).toBeInTheDocument();
    expect(
      screen.getByText(/Try a different search term/),
    ).toBeInTheDocument();
  });
});
