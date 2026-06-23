const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Demasiados intentos de inicio de sesión. Inténtelo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Demasiadas solicitudes de restablecimiento. Inténtelo de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: 'Límite de subidas alcanzado. Inténtelo de nuevo en una hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, forgotPasswordLimiter, uploadLimiter };
