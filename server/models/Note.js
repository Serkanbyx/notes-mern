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

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      enum: {
        values: NOTE_COLORS,
        message: "Color must be one of: " + NOTE_COLORS.join(", "),
      },
      default: "yellow",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
