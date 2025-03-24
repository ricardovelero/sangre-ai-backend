// routes/notes.routes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const notesController = require("../controllers/notes.controller");
// Create a new note for an analitica
// POST /api/analiticas/:analiticaId/notes
router.post("/:analiticaId/notes", verifyToken, notesController.createNote);

// Get all notes for an analitica
// GET /api/analiticas/:analiticaId/notes
router.get("/:analiticaId/notes", verifyToken, notesController.getNotes);

// Get a specific note
// GET /api/analiticas/:analiticaId/notes/:noteId
router.get("/:analiticaId/notes/:noteId", verifyToken, notesController.getNote);

// Update a note
// PUT /api/analiticas/:analiticaId/notes/:noteId
router.put(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  notesController.updateNote
);

// Delete a note
// DELETE /api/analiticas/:analiticaId/notes/:noteId
router.delete(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  notesController.deleteNote
);

module.exports = router;
