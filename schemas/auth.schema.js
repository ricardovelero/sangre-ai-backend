const { z } = require("zod");

// Las contraseñas solo se validan aquí en cuanto a tipo/presencia.
// La fortaleza (longitud, complejidad) la sigue comprobando
// checkPasswordStrength en los controladores, para no duplicar reglas.
const nonEmptyString = z.string().min(1);

const registerSchema = z.object({
  email: z.email(),
  password: nonEmptyString,
  firstName: nonEmptyString.optional(),
  lastName: nonEmptyString.optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: nonEmptyString,
});

const refreshTokenSchema = z.object({
  refreshToken: nonEmptyString,
});

const logoutSchema = z.object({
  refreshToken: nonEmptyString,
});

const forgotPasswordSchema = z.object({
  email: z.email(),
});

const resetPasswordSchema = z.object({
  token: nonEmptyString,
  newPassword: nonEmptyString,
});

const updatePasswordSchema = z.object({
  currentPassword: nonEmptyString,
  newPassword: nonEmptyString,
});

const updateUserSchema = z.object({
  email: z.email().optional(),
  firstName: nonEmptyString.optional(),
  lastName: nonEmptyString.optional(),
  phone: nonEmptyString.optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
};
