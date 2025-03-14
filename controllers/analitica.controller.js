const db = require("../models");
const Analitica = db.Analitica;

/**
 * @desc Buscar una analitica por id
 * @route GET /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getAnalitica = async (req, res, next) => {
  try {
    const { id } = req.params;

    const analitica = await Analitica.findById(id).select("_id markdown");

    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada." });
    }

    res.json(analitica);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Todas las analiticas para el usuario
 * @route GET /api/analiticas
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getTodasAnaliticas = async (req, res, next) => {
  const userId = req.userData.id;
  if (!userId) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }
  try {
    const analiticas = await Analitica.find({ owner: userId });

    res.json(analiticas ?? []);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAnalitica,
  getTodasAnaliticas,
};
