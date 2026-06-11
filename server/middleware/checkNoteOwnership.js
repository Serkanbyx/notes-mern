const Note = require("../models/Note");

/**
 * Finds the note by ID and verifies the authenticated user owns it.
 * Attaches `req.note` on success. Param validation runs earlier via
 * the validator chain + handleValidation middleware.
 */
const checkNoteOwnership = async (req, res, next) => {
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

    req.note = note;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkNoteOwnership;
