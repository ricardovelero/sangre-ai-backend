const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure tag names are unique
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

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
