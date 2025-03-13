const mongoose = require("mongoose");

const analiticaSchema = new mongoose.Schema(
  {
    markdown: {
      type: String,
      required: true,
    },
    datos_analitica: {
      type: Object,
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Crear y exportar el modelo
const Analitica = mongoose.model("Analitica", analiticaSchema);
module.exports = Analitica;
