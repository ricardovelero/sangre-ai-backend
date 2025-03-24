// controllers/tags.controller.js
const Tag = require("../models/tag.model");
const Analitica = require("../models/analitica.model");

// Create a new tag
const createTag = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.userData.id;

  try {
    // Check if tag already exists for this user
    const existingTag = await Tag.findOne({
      name: name.toLowerCase(),
      owner: userId,
    });

    if (existingTag) {
      return res.status(400).json({
        message: "Ya existe una etiqueta con este nombre",
      });
    }

    const tag = new Tag({
      name: name.toLowerCase(),
      description,
      owner: userId,
    });

    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la etiqueta",
      error: error.message,
    });
  }
};

// Get all tags
const getTags = async (req, res) => {
  const userId = req.userData.id;

  try {
    const tags = await Tag.find({ owner: userId }).sort({ name: 1 }); // Sort alphabetically

    res.json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las etiquetas",
      error: error.message,
    });
  }
};

// Get a specific tag and its associated analytics
const getTag = async (req, res) => {
  const { tagId } = req.params;
  const userId = req.userData.id;

  try {
    const tag = await Tag.findOne({
      _id: tagId,
      owner: userId,
    });

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada",
      });
    }

    // Find analytics that use this tag
    const analiticas = await Analitica.find({
      tags: tagId,
      owner: userId,
    }).select("_id fecha_toma_muestra laboratorio"); // Select only necessary fields

    res.json({
      tag,
      analiticas,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la etiqueta",
      error: error.message,
    });
  }
};

// Delete a tag
const deleteTag = async (req, res) => {
  const { tagId } = req.params;
  const userId = req.userData.id;

  try {
    const tag = await Tag.findOne({
      _id: tagId,
      owner: userId,
    });

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada",
      });
    }

    // Remove tag reference from all analytics
    await Analitica.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    // Delete the tag
    await Tag.findByIdAndDelete(tagId);

    res.json({
      message: "Etiqueta eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la etiqueta",
      error: error.message,
    });
  }
};

module.exports = {
  createTag,
  getTags,
  getTag,
  deleteTag,
};
