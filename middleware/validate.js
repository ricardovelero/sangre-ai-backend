/**
 * Middleware genérico de validación con Zod.
 * Valida `req.body` contra el esquema dado. Si es válido, reemplaza
 * `req.body` con los datos parseados (tipos garantizados y claves
 * desconocidas eliminadas). Si no, responde 400 con los errores.
 *
 * @param {import("zod").ZodType} schema
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return next();
};

module.exports = validate;
