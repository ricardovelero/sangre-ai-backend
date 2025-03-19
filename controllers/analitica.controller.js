const db = require("../models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");

/**
 * @desc Buscar una analítica por id
 * @route GET /api/analitica/:id
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
const getAnalitica = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userData.id;

  if (!userId) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de analítica no válido" });
  }

  try {
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
    const analiticas = await Analitica.find({ owner: userId });

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

  if (!userId) {
    return res.status(400).json({ error: "Usuario no encontrado" });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID de analítica no válido" });
  }
  try {
    const analitica = await Analitica.findByIdAndDelete(id);
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
  const ownerId = req.userData.id;

  try {
    const data = await Analitica.aggregate([
      {
        $match: {
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
const getSerie = async (req, res) => {
  try {
    const { tipo } = req.query;

    if (!tipo) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un tipo de serie válido" });
    }

    let datos;
    let matchStage = {
      $match: {
        owner: new mongoose.Types.ObjectId(req.userData.id),
      },
    };

    try {
      switch (tipo) {
        case "serie-blanca":
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
                      $in: [
                        "$$item.codigo_loinc",
                        [
                          "6690-2",
                          "751-8",
                          "736-9",
                          "736-7",
                          "742-7",
                          "742-5",
                          "713-8",
                          "704-6",
                          "753-4",
                          "731-0",
                          "740-1",
                          "711-2",
                          "706-2",
                          "706-1",
                          "706-0",
                          "706-3",
                          "706-4",
                          "706-5",
                          "706-6",
                          "706-7",
                          "770-8",
                          "5905-5",
                          "26499-4",
                          "26474-7",
                          "26484-6",
                        ],
                      ],
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
                      $in: [
                        "$$item.codigo_loinc",
                        [
                          "789-8",
                          "718-7",
                          "4544-3",
                          "785-6",
                          "787-2",
                          "716-1",
                          "717-9",
                          "787-2",
                          "33959-8",
                          "20571-5",
                        ],
                      ],
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
                      $in: [
                        "$$item.codigo_loinc",
                        [
                          "2093-3",
                          "2085-1",
                          "2089-9",
                          "18268-1",
                          "2571-8",
                          "56042-2",
                          "1884-7",
                          "43380-0",
                          "30575-9",
                          "1872-0",
                        ],
                      ],
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
    } catch (error) {
      console.error("❌ Error en la consulta MongoDB:", error);
      console.error("Stack trace:", error.stack);
      return res.status(500).json({
        error: `Error al obtener la serie ${tipo}. Inténtelo más tarde.`,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    // Return empty array if no data found
    datos = datos || [];

    res.json(datos);
  } catch (error) {
    console.error("❌ Error inesperado en el servidor:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Error interno del servidor. Inténtelo más tarde.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAnalitica,
  getTodasAnaliticas,
  deleteAnalitica,
  getSerie,
  getLipidos,
};
