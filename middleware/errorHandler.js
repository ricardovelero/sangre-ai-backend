// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err);

  // Si el error tiene un código de estado, úsalo; de lo contrario, usa 500
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Error interno del servidor.",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // Solo mostrar stack en desarrollo
  });
};
