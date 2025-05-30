const db = require("../models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");
const {
  serieBlancaSearchTerms,
  serieRojaSearchTerms,
  serieLipidosSearchTerms,
} = require("../lib/seriesSearchTerms");

/**
 * @desc Buscar una analítica por id
 * @route GET /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getAnalitica = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userData.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de analítica no válido" });
  }

  try {
    const analitica = await Analitica.findOne({
      _id: id,
      owner: userId,
    }).populate("tags"); // Fetch associated tags

    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada." });
    }

    res.json(analitica);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Actualizar una analítica por id
 * @route PUT /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const updateAnalitica = async (req, res, next) => {
  console.log("Updating analitica");

  const { id } = req.params;
  const userId = req.userData.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de analítica no válido" });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No se proporcionaron datos" });
  }

  try {
    const analitica = await Analitica.findOneAndUpdate(
      { _id: id, owner: userId },
      {
        $set: {
          laboratorio: req.body.laboratorio,
          medico: req.body.medico,
          "paciente.nombre": req.body.nombre,
          "paciente.apellidos": req.body.apellidos,
          fecha_toma_muestra: req.body.fecha,
        },
      },
      { new: true, runValidators: true }
    );

    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada." });
    }

    res.json(analitica);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Todas las analíticas para el usuario
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
    const analiticas = await Analitica.find({ owner: userId }).sort({
      fecha_toma_muestra: -1,
    });

    res.json(analiticas ?? []);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Eliminar una analítica por id
 * @route DELETE /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const deleteAnalitica = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userData.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de analítica no válido" });
  }
  try {
    const analitica = await Analitica.findOneAndDelete({
      _id: id,
      owner: userId,
    });
    if (!analitica) {
      return res.status(404).json({ message: "Analitica no encontrada." });
    }
    res.json({ message: "Analitica eliminada correctamente." });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Devuelve la serie lípidos las analíticas de un usuario
 * @route GET /api/analitica/lipidos
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getLipidos = async (req, res, next) => {
  const userId = req.userData.id;

  try {
    const data = await Analitica.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId), // Asegurar que pertenece al usuario autenticado
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
          lipidos: {
            colesterol_total:
              "$datos_analitica.analitica.bioquimica_clinica.colesterol_total",
            HDL: "$datos_analitica.analitica.bioquimica_clinica.HDL",
            LDL: "$datos_analitica.analitica.bioquimica_clinica.LDL",
            trigliceridos:
              "$datos_analitica.analitica.bioquimica_clinica.trigliceridos",
          },
        },
      },
    ]);

    return res.status(200).json(
      data.map((entry) => ({
        fecha: entry.fecha,
        ...entry.lipidos,
      }))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una serie de datos específicos de análisis de sangre según el parámetro `tipo`.
 *
 * @param {import("express").Request} req - Objeto de solicitud de Express, que debe incluir un `query` con el tipo de serie a recuperar.
 * @param {import("express").Response} res - Objeto de respuesta de Express.
 *
 * @returns {void} - Devuelve una respuesta JSON con los datos de la serie solicitada o un mensaje de error.
 *
 * @throws {Error} - Captura y maneja errores de conexión con la base de datos y errores internos del servidor.
 *
 * @example
 * // Solicitar datos de la serie blanca:
 * GET /api/analiticas/series?tipo=serie-blanca
 *
 * // Posibles respuestas:
 * // 200 OK - Datos encontrados:
 * {
 *   "fecha": "2025-03-10T00:00:00.000Z",
 *   "valores": { "leucocitos": 6000, "neutrofilos": 55, "linfocitos": 35 }
 * }
 *
 * // 400 Bad Request - Tipo de serie no válido:
 * { "error": "Tipo de serie no válido" }
 *
 * // 404 Not Found - No hay datos en la base de datos:
 * { "error": "No se encontraron datos para la serie serie-blanca." }
 *
 * // 500 Internal Server Error - Error de conexión con MongoDB:
 * { "error": "Error al obtener la serie lipidos. Inténtelo más tarde." }
 */
const getSerie = async (req, res, next) => {
  const userId = req.userData.id;
  const { tipo } = req.query;

  if (!tipo) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un tipo de serie válido" });
  }

  let datos;
  let searchTerms;
  let matchStage = {
    $match: {
      owner: new mongoose.Types.ObjectId(userId),
    },
  };

  try {
    switch (tipo) {
      case "serie-blanca":
        searchTerms = serieBlancaSearchTerms;
        datos = await Analitica.aggregate([
          matchStage,
          {
            $project: {
              _id: 0,
              fecha_toma_muestra: 1,
              resultados: {
                $filter: {
                  input: "$resultados",
                  as: "item",
                  cond: {
                    $in: ["$$item.nombre_normalizado", serieBlancaSearchTerms],
                  },
                },
              },
            },
          },
          {
            $match: {
              resultados: { $ne: null, $not: { $size: 0 } },
            },
          },
          { $sort: { fecha_toma_muestra: 1 } },
        ]);
        break;
      case "serie-roja":
        searchTerms = serieRojaSearchTerms;
        datos = await Analitica.aggregate([
          matchStage,
          {
            $project: {
              _id: 0,
              fecha_toma_muestra: 1,
              resultados: {
                $filter: {
                  input: "$resultados",
                  as: "item",
                  cond: {
                    $in: ["$$item.nombre_normalizado", serieRojaSearchTerms],
                  },
                },
              },
            },
          },
          {
            $match: {
              resultados: { $ne: null, $not: { $size: 0 } },
            },
          },
          { $sort: { fecha_toma_muestra: 1 } },
        ]);
        break;
      case "lipidos":
        searchTerms = serieLipidosSearchTerms;
        datos = await Analitica.aggregate([
          matchStage,
          {
            $project: {
              _id: 0,
              fecha_toma_muestra: 1,
              resultados: {
                $filter: {
                  input: "$resultados",
                  as: "item",
                  cond: {
                    $in: ["$$item.nombre_normalizado", serieLipidosSearchTerms],
                  },
                },
              },
            },
          },
          {
            $match: {
              resultados: { $ne: null, $not: { $size: 0 } },
            },
          },
          { $sort: { fecha_toma_muestra: 1 } },
        ]);
        break;

      default:
        return res.status(400).json({ error: "Tipo de serie no válido" });
    }

    // Return empty array if no data found
    datos = datos || [];

    res.json({ parameters: searchTerms, results: datos });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalitica,
  getTodasAnaliticas,
  deleteAnalitica,
  getSerie,
  getLipidos,
  updateAnalitica,
};
