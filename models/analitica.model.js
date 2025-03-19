const mongoose = require("mongoose");

const analiticaSchema = new mongoose.Schema(
  {
    paciente: {
      type: Object,
      required: true,
    },
    fecha_toma_muestra: {
      type: Date,
      required: true,
    },
    fecha_informe: {
      type: Date,
    },
    laboratorio: {
      type: String,
    },
    medico: {
      type: String,
    },
    markdown: {
      type: String,
      required: true,
    },
    resultados: {
      type: Array,
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Crear y exportar el modelo
const Analitica = mongoose.model("Analitica", analiticaSchema);
module.exports = Analitica;
