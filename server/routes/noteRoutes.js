const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const checkNoteOwnership = require("../middleware/checkNoteOwnership");
const handleValidation = require("../middleware/handleValidation");
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
router.get(
  "/:id",
  objectIdValidator,
  handleValidation,
  checkNoteOwnership,
  getNoteById,
);
router.post("/", createNoteValidator, handleValidation, createNote);
router.put(
  "/:id",
  updateNoteValidator,
  handleValidation,
  checkNoteOwnership,
  updateNote,
);
router.patch(
  "/:id/pin",
  objectIdValidator,
  handleValidation,
  checkNoteOwnership,
  togglePin,
);
router.delete(
  "/:id",
  objectIdValidator,
  handleValidation,
  checkNoteOwnership,
  deleteNote,
);

module.exports = router;
