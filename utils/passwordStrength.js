function checkPasswordStrength(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "La contraseña es requerida" };
  }
  if (password.length < 8) {
    return {
      valid: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos una letra mayúscula",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos una letra minúscula",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos un número",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      valid: false,
      message: "La contraseña debe contener al menos un carácter especial",
    };
  }
  return { valid: true };
}

module.exports = { checkPasswordStrength };
