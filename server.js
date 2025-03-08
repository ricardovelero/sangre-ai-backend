require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY) {
  console.log("API Key de Google AI cargada.");
} else {
  console.log("API Key de Google AI no encontrada.");
}

const app = express();
const upload = multer({ dest: "/tmp/" });

app.use(cors());

app.use(express.json());

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

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió un archivo PDF." });
    }

    console.log(`Archivo recibido: ${req.file.originalname}`);

    const response = await sendToGoogleAi(req.file.path);

    res.json({ message: "PDF procesado con éxito.", text: response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error procesando el PDF.", error: error.toString() });
  }
});

// Manejar rutas no definidas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
