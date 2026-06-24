// routes/notes.routes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  createNoteSchema,
  updateNoteSchema,
} = require("../schemas/notes.schema");
const notesController = require("../controllers/notes.controller");

router.post(
  "/:analiticaId/notes",
  verifyToken,
  validate(createNoteSchema),
  notesController.createNote
);

router.get("/:analiticaId/notes", verifyToken, notesController.getNotes);

router.get("/:analiticaId/notes/:noteId", verifyToken, notesController.getNote);

router.put(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  validate(updateNoteSchema),
  notesController.updateNote
);

router.delete(
  "/:analiticaId/notes/:noteId",
  verifyToken,
  notesController.deleteNote
);

module.exports = router;
