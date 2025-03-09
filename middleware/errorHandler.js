module.exports = (err, req, res, next) => {
  console.error(err);

  // Manejar errores específicos de Multer
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "El archivo es demasiado grande. Máximo permitido: 1 MB.",
    });
  }

  if (
    err.message ===
    "Formato no soportado. Solo se aceptan PDFs e imágenes JPG, PNG, Webp, HEIC, HEIF."
  ) {
    return res.status(400).json({ message: err.message });
  }

  // Si el error tiene un código de estado, úsalo; de lo contrario, usa 500
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Error interno del servidor.",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Solo mostrar stack en desarrollo
  });
};
