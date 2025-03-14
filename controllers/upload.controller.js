require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompts = require("../lib/prompts");
const db = require("../models");
const Analitica = db.Analitica;

const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  console.log("API Key de Google AI cargada.");
} else {
  console.log("API Key de Google AI no encontrada.");
}

/**
 * @desc Subir un archivo PDF, enviarlo a Google AI para procesarlo, y guardar en DB
 * @route POST /api/upload
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
exports.upload = async (req, res, next) => {
  const userId = req.userData.id;
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se recibió un archivo válido." });
    }

    console.log(
      `Archivo recibido: ${req.file.originalname}, mimetype: ${req.file.mimetype}, tamaño: ${req.file.size} bytes`
    );

    const response = await sendToGoogleAi(req.file.path, req.file.mimetype);

    // Eliminar el archivo después de procesarlo
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error eliminando archivo:", err);
    });

    const markdown = extractMarkdown(response);

    const json = extractJSON(response);

    const responseDB = await guardarAnalitica(markdown, json, userId);

    if (!responseDB) {
      return res.status(500).json({
        message: "❌ Error al guardar la analítica en la base de datos.",
      });
    }

    res.json({
      message: "Archivo procesado y guardado con éxito.",
      _id: responseDB._id, // Retorna el ID del documento guardado en MongoDB
      text: markdown,
    });
  } catch (err) {
    next(err); // Pasar el error al middleware de manejo de errores
  }
};

// Converts local file information to base64
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
const sendToGoogleAi = async (filePath, mimeType) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = prompts.promptComplejo;

  // Convertir el archivo en base64 y enviarlo a Gemini
  const imageParts = [fileToGenerativePart(filePath, mimeType)];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);

  console.log(generatedContent.response.text());

  return generatedContent.response.text();
};

// Procesar el JSON y Markdown recibido
const extractJSON = (responseText) => {
  const jsonMatch = responseText.match(/<<<json\n([\s\S]*?)\n>>>/);
  return jsonMatch && jsonMatch[1] ? JSON.parse(jsonMatch[1]) : null;
};

const extractMarkdown = (responseText) => {
  return responseText
    .replace(/<<<json\n[\s\S]*?\n>>>/, "")
    .replace(/^```json\n/, "")
    .trim();
};

const guardarAnalitica = async (markdown, jsonData, userId) => {
  try {
    const nuevaAnalitica = new Analitica({
      markdown,
      datos_analitica: jsonData.datos_analitica,
      owner: userId,
    });

    const analiticaGuardada = await nuevaAnalitica.save();
    console.log("✅ Analítica guardada en MongoDB.");
    return analiticaGuardada;
  } catch (error) {
    console.error("❌ Error al guardar la analítica:", error);
    return null;
  }
};
