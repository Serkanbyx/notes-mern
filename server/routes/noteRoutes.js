const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const checkNoteOwnership = require("../middleware/checkNoteOwnership");
const {
  objectIdValidator,
  createNoteValidator,
  updateNoteValidator,
} = require("../validators/noteValidator");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePin,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

router.use(verifyToken);

router.get("/", getAllNotes);
router.get("/:id", objectIdValidator, checkNoteOwnership, getNoteById);
router.post("/", createNoteValidator, createNote);
router.put("/:id", updateNoteValidator, checkNoteOwnership, updateNote);
router.patch("/:id/pin", objectIdValidator, checkNoteOwnership, togglePin);
router.delete("/:id", objectIdValidator, checkNoteOwnership, deleteNote);

module.exports = router;
