const Note = require("../models/Note");

// @desc    Get all notes for authenticated user
// @route   GET /api/notes
const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to access this note" });
    }

    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
const createNote = async (req, res, next) => {
  try {
    const { title, content, color } = req.body;

    const note = await Note.create({
      title,
      content,
      color,
      userId: req.user.userId,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing note
// @route   PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this note" });
    }

    const { title, content, color } = req.body;

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.color = color ?? note.color;

    const updatedNote = await note.save();

    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin status of a note
// @route   PATCH /api/notes/:id/pin
const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to update this note" });
    }

    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();

    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    if (note.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to delete this note" });
    }

    await note.deleteOne();

    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePin,
  deleteNote,
};
