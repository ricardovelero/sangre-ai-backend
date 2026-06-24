const { z } = require("zod");

// ObjectId de MongoDB: 24 caracteres hexadecimales.
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID no válido");

const createTagSchema = z.object({
  name: z.string().min(1),
  analiticaId: objectId,
});

module.exports = { createTagSchema };
