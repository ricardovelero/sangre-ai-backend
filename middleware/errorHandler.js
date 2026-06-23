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
  const isDev = process.env.NODE_ENV === "development";

  // Los errores de cliente (4xx) suelen llevar un mensaje intencional y seguro.
  // Para errores de servidor (5xx) ocultamos el mensaje interno en producción
  // para no filtrar detalles de implementación.
  const exposeMessage = isDev || statusCode < 500;

  res.status(statusCode).json({
    message: exposeMessage
      ? err.message || "Error interno del servidor."
      : "Error interno del servidor.",
    error: isDev ? err.stack : undefined, // Solo mostrar stack en desarrollo
  });
};
