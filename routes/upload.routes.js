const express = require("express");
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploads = require("../controllers/upload.controller.js");

const router = express.Router();

// Ensure the uploads directory exists
// old code: const uploadDir = path.join(__dirname, "/tmp/");
const uploadDir = "/tmp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer to store files in disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    cb(null, true); // Accept file first, we'll validate it later
  },
});

// Route to upload files
router.post("/", verifyToken, upload.single("file"), async (req, res, next) => {
  const { fileTypeFromFile } = await import("file-type");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se cargó un archivo." });
    }

    // Validate file type AFTER it has been temporarily saved
    const fileType = await fileTypeFromFile(req.file.path);
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error borrando archivo no válido:", err);
      });
      return res.status(400).json({
        message:
          "Formato no soportado. Solo se aceptan PDFs e imágenes JPG, PNG, Webp, HEIC, HEIF.",
      });
    }

    // If file is valid, pass it to the controller
    uploads.upload(req, res, next);
  } catch (error) {
    console.error("Error verificando el archivo:", error);
    res.status(500).json({ message: "Error procesando el archivo." });
  }
});

module.exports = router;
