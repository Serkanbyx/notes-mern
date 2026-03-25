const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePin,
  deleteNote,
} = require("../controllers/noteController");

const router = express.Router();

// All note routes require authentication
router.use(verifyToken);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.patch("/:id/pin", togglePin);
router.delete("/:id", deleteNote);

module.exports = router;
