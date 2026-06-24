const { z } = require("zod");

// Todos los campos son opcionales: updateAnalitica actualiza solo los
// proporcionados. Las claves desconocidas se eliminan automáticamente.
const updateAnaliticaSchema = z.object({
  laboratorio: z.string().min(1).optional(),
  medico: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  apellidos: z.string().min(1).optional(),
  fecha: z.coerce.date().optional(),
});

module.exports = { updateAnaliticaSchema };
