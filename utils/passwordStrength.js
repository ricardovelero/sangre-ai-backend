const { z } = require("zod");

// Esquema único de fortaleza de contraseña. Se compone en los esquemas de
// rutas (auth.schema.js) y también lo envuelve checkPasswordStrength para
// usos fuera de la capa HTTP y para los tests unitarios.
const passwordSchema = z
  .string({ error: "La contraseña es requerida" })
  .min(8, { error: "La contraseña debe tener al menos 8 caracteres" })
  .regex(/[A-Z]/, {
    error: "La contraseña debe contener al menos una letra mayúscula",
  })
  .regex(/[a-z]/, {
    error: "La contraseña debe contener al menos una letra minúscula",
  })
  .regex(/[0-9]/, {
    error: "La contraseña debe contener al menos un número",
  })
  .regex(/[^A-Za-z0-9]/, {
    error: "La contraseña debe contener al menos un carácter especial",
  });

/**
 * Comprueba la fortaleza de una contraseña.
 * Devuelve la misma forma {valid, message} que antes; el mensaje corresponde
 * a la primera regla incumplida (mismo orden que las comprobaciones).
 */
function checkPasswordStrength(password) {
  const result = passwordSchema.safeParse(password);
  if (result.success) {
    return { valid: true };
  }
  return { valid: false, message: result.error.issues[0].message };
}

module.exports = { checkPasswordStrength, passwordSchema };
