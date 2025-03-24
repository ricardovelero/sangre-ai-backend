// routes/notes.routes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const notesController = require("../controllers/notes.controller");

router.post("/:analiticaId/notes", verifyToken, notesController.createNote);

router.get("/:analiticaId/notes", verifyToken, notesController.getNotes);

router.get("/:analiticaId/notes/:noteId", verifyToken, notesController.getNote);

router.put(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  notesController.updateNote
);

router.delete(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  notesController.deleteNote
);

module.exports = router;
