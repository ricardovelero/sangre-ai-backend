const db = require("../models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");

// Create a new note
const createNote = async (req, res, next) => {
  const { analiticaId } = req.params;
  const { content } = req.body;
  const userId = req.userData.id;

  try {
    const analitica = await Analitica.findOne({
      _id: analiticaId,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada" });
    }

    analitica.notas.push({
      content,
      owner: userId,
    });

    await analitica.save();
    res.status(201).json(analitica.notas[analitica.notas.length - 1]);
  } catch (error) {
    next(error);
  }
};

// Get all notes
const getNotes = async (req, res, next) => {
  const { analiticaId } = req.params;
  const userId = req.userData.id;

  try {
    const analitica = await Analitica.findOne({
      _id: analiticaId,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada" });
    }

    res.json(analitica.notas);
  } catch (error) {
    next(error);
  }
};

// Get a specific note
const getNote = async (req, res, next) => {
  const { analiticaId, noteId } = req.params;
  const userId = req.userData.id;

  try {
    const analitica = await Analitica.findOne({
      _id: analiticaId,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada" });
    }

    const note = analitica.notas.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// Update a note
const updateNote = async (req, res, next) => {
  const { analiticaId, noteId } = req.params;
  const { content } = req.body;
  const userId = req.userData.id;

  try {
    const analitica = await Analitica.findOne({
      _id: analiticaId,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada" });
    }

    const note = analitica.notas.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    note.content = content;
    await analitica.save();

    res.json(note);
  } catch (error) {
    next(error);
  }
};

// Delete a note
const deleteNote = async (req, res, next) => {
  const { analiticaId, noteId } = req.params;
  const userId = req.userData.id;

  try {
    const analitica = await Analitica.findOne({
      _id: analiticaId,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada" });
    }

    analitica.notas.pull(noteId);
    await analitica.save();

    res.json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
