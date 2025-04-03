require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const prompts = require("../lib/prompts");
const db = require("../models");
const Analitica = db.Analitica;
const { normalizeString, toTitleCase } = require("../lib/utils");

const API_KEY = process.env.GEMINI_API_KEY;

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

    if (response === "El archivo subido no es una analítica de sangre.") {
      return res.status(422).json({
        mensaje: response,
      });
    }

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
  const generationConfig = {
    temperature: 0.4,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 16384,
    responseMimeType: "text/plain",
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: prompts.systemInstruction,
    generationConfig,
  });

  // Convertir el archivo en base64 y enviarlo a Gemini
  const imageParts = [fileToGenerativePart(filePath, mimeType)];

  const generatedContent = await model.generateContent([
    prompts.attiaPrompt,
    ...imageParts,
  ]);

  console.log(generatedContent.response.text());

  return generatedContent.response.text();
};

// Procesar el JSON y Markdown recibido
const extractJSON = (responseText) => {
  try {
    const match = responseText.match(/```json\s*([\s\S]*?)```/);
    if (!match) return null;
    return JSON.parse(match[1].trim());
  } catch (error) {
    console.error("❌ Error al parsear JSON:", error.message);
    return null;
  }
};

const extractMarkdown = (responseText) => {
  return responseText
    .replace(/```json\n[\s\S]*?\n```/, "")
    .replace(/^```json\n/, "")
    .trim();
};

const guardarAnalitica = async (markdown, jsonData, userId) => {
  try {
    const nuevaAnalitica = new Analitica({
      paciente: jsonData.paciente,
      fecha_toma_muestra: jsonData.fecha_toma_muestra,
      fecha_informe: jsonData.fecha_informe,
      laboratorio: jsonData.laboratorio,
      medico: jsonData.medico,
      markdown,
      resumen: jsonData.resumen,
      resultados: jsonData.resultados,
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
