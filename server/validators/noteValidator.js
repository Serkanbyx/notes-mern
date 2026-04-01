const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const NOTE_COLORS = [
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
];

const objectIdValidator = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("Invalid note ID");
    }
    return true;
  }),
];

const createNoteValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  body("color")
    .optional()
    .isIn(NOTE_COLORS)
    .withMessage(`Color must be one of: ${NOTE_COLORS.join(", ")}`),
];

const updateNoteValidator = [
  ...objectIdValidator,

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string"),

  body("color")
    .optional()
    .isIn(NOTE_COLORS)
    .withMessage(`Color must be one of: ${NOTE_COLORS.join(", ")}`),
];

module.exports = {
  objectIdValidator,
  createNoteValidator,
  updateNoteValidator,
};
