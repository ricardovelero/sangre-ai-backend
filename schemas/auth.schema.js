const { z } = require("zod");
const { passwordSchema } = require("../utils/passwordStrength");

const nonEmptyString = z.string().min(1);

const registerSchema = z.object({
  email: z.email(),
  password: passwordSchema,
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
  newPassword: passwordSchema,
});

const updatePasswordSchema = z.object({
  currentPassword: nonEmptyString,
  newPassword: passwordSchema,
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
