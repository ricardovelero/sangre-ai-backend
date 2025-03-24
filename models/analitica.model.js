const mongoose = require("mongoose");

const NotaSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

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
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notas: [NotaSchema],
  },
  { timestamps: true }
);

// Crear y exportar el modelo
const Analitica = mongoose.model("Analitica", analiticaSchema);
module.exports = Analitica;
