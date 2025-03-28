const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove whitespace
    lowercase: true, // Store tags in lowercase
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Índice compuesto: nombre + dueño debe ser único
tagSchema.index({ name: 1, owner: 1 }, { unique: true });

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
