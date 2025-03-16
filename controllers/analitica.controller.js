const db = require("../models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");

/**
 * @desc Buscar una analitica por id
 * @route GET /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getAnalitica = async (req, res, next) => {
  const userId = req.userData.id;
  if (!userId) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }
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

/**
 * @desc Devuelve la serie blanca de una analitica del usuario
 * @route GET /api/analitica/:id/serie-blanca
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getSerieBlanca = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.userData.id; // `verifyToken` debe agregar `req.user` con el ID del usuario autenticado

  if (!id) {
    return res.status(400).json({ message: "Se requiere un ID de analítica" });
  }

  try {
    const data = await Analitica.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id), // Filtrar por ID de la analítica
          owner: new mongoose.Types.ObjectId(ownerId), // Asegurar que pertenece al usuario autenticado
        },
      },
      {
        $sort: { "datos_analitica.paciente.fecha_toma_muestra": -1 }, // Ordenar por fecha descendente
      },
      {
        $limit: 6, // Obtener los últimos 6 análisis
      },
      {
        $project: {
          _id: 0,
          fecha: "$datos_analitica.paciente.fecha_toma_muestra",
          serie_blanca: "$datos_analitica.analitica.serie_blanca",
        },
      },
    ]);
    return res.status(200).json(
      data.map((entry) => ({
        fecha: entry.fecha,
        ...entry.serie_blanca, // Expande la serie blanca para facilitar el uso en el frontend
      }))
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalitica,
  getTodasAnaliticas,
  getSerieBlanca,
};
