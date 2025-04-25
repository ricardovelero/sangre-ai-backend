const { checkPasswordStrength } = require("../utils/passwordStrength");

describe("checkPasswordStrength", () => {
  it("should fail if password is missing", () => {
    expect(checkPasswordStrength()).toEqual({
      valid: false,
      message: "La contraseña es requerida",
    });
  });

  it("should fail if password is less than 8 characters", () => {
    expect(checkPasswordStrength("Ab1!")).toEqual({
      valid: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    });
  });

  it("should fail if missing uppercase", () => {
    expect(checkPasswordStrength("testpass1!")).toEqual({
      valid: false,
      message: "La contraseña debe contener al menos una letra mayúscula",
    });
  });

  it("should fail if missing lowercase", () => {
    expect(checkPasswordStrength("TESTPASS1!")).toEqual({
      valid: false,
      message: "La contraseña debe contener al menos una letra minúscula",
    });
  });

  it("should fail if missing number", () => {
    expect(checkPasswordStrength("TestPass!")).toEqual({
      valid: false,
      message: "La contraseña debe contener al menos un número",
    });
  });

  it("should fail if missing special character", () => {
    expect(checkPasswordStrength("TestPass1")).toEqual({
      valid: false,
      message: "La contraseña debe contener al menos un carácter especial",
    });
  });

  it("should pass for a strong password", () => {
    expect(checkPasswordStrength("TestPass1!")).toEqual({ valid: true });
  });
});
