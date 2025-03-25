// controllers/tags.controller.js
const Tag = require("../models/tag.model");
const Analitica = require("../models/analitica.model");

// Create a new tag or add an existing one to an Analitica
const createOrAddTag = async (req, res, next) => {
  const { name, analiticaId } = req.body;
  const userId = req.userData.id;

  try {
    // Manually implement findOrCreate logic
    let tag = await Tag.findOne({ name: name.toLowerCase(), owner: userId });
    if (!tag) {
      tag = await Tag.create({
        name: name.toLowerCase(),
        owner: userId,
      });
    }

    const analitica = await Analitica.findById(analiticaId);
    if (!analitica) {
      return res.status(404).json({ message: "Analitica not found" });
    }

    if (analitica.tags.includes(tag._id)) {
      return res
        .status(201)
        .json({ message: "Etiqueta ya incluida en analitica", tag });
    }

    analitica.tags.push(tag._id);

    await analitica.save();
    res.status(201).json({ message: "Etiqueta agregada con éxito.", tag });
  } catch (error) {
    next(error);
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

// Delete a tag from all Analiticas and DB
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

// Remove a tag from an Analitica
const removeTag = async (req, res) => {
  const { tagId, analiticaId } = req.params;
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
    await Analitica.updateOne({ _id: analiticaId }, { $pull: { tags: tagId } });

    res.json({
      message: "Etiqueta eliminada de Analitica.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la etiqueta",
      error: error.message,
    });
  }
};

module.exports = {
  createOrAddTag,
  getTags,
  getTag,
  removeTag,
  deleteTag,
};
