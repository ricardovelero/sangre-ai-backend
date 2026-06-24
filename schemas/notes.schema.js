const { z } = require("zod");

const noteSchema = z.object({
  content: z.string().min(1),
});

module.exports = {
  createNoteSchema: noteSchema,
  updateNoteSchema: noteSchema,
};
