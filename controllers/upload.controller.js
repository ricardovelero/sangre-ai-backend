require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  console.log("API Key de Google AI cargada.");
} else {
  console.log("API Key de Google AI no encontrada.");
}

/**
 * @desc Subir un archivo PDF y enviarlo a Google AI para procesarlo
 * @route POST /api/upload
 * @type Route Handler
 * @access Privado (autenticación requerida)
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió un archivo PDF." });
    }

    console.log(`Archivo recibido: ${req.file.originalname}`);

    const response = await sendToGoogleAi(req.file.path);

    // Eliminar el archivo después de procesarlo
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error eliminando archivo:", err);
    });

    res.json({ message: "PDF procesado con éxito.", text: response });
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
const sendToGoogleAi = async (pdfPath) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt =
    "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

  const imageParts = [fileToGenerativePart(pdfPath, "application/pdf")];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);

  console.log(generatedContent.response.text());

  return generatedContent.response.text();
};
