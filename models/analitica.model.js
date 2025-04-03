const mongoose = require("mongoose");
const { normalizeStringAndFixSomeNames, toTitleCase } = require("../lib/utils");

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

const ResultadoSchema = new mongoose.Schema({
  nombre: String,
  codigo_loinc: String,
  valor: Number,
  unidad: String,
  nombre_normalizado: String,
});

const PacienteSchema = new mongoose.Schema({
  dni: String,
  nombre: String,
  apellidos: String,
  fecha_nacimiento: Date,
  sexo: String,
  juicio_clinico: String,
});

const analiticaSchema = new mongoose.Schema(
  {
    paciente: {
      type: PacienteSchema,
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
    resumen: {
      type: String,
    },
    markdown: {
      type: String,
      required: true,
    },
    resultados: {
      type: [ResultadoSchema],
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

analiticaSchema.pre("save", function (next) {
  if (this.laboratorio) {
    this.laboratorio = toTitleCase(this.laboratorio);
  }
  if (this.medico) {
    this.medico = toTitleCase(this.medico);
  }
  if (this.paciente) {
    if (this.paciente.nombre) {
      this.paciente.nombre = toTitleCase(this.paciente.nombre);
    }
    if (this.paciente.apellidos) {
      this.paciente.apellidos = toTitleCase(this.paciente.apellidos);
    }
  }
  this.resultados = this.resultados.map((r) => {
    let valor = r.valor;
    if (typeof valor === "string") {
      const normalizado = parseFloat(valor.replace(",", "."));
      valor = isNaN(normalizado) ? valor : normalizado;
    }

    const nombre_normalizado = r.nombre
      ? normalizeStringAndFixSomeNames(r.nombre)
      : r.nombre_normalizado;

    return {
      ...r,
      valor,
      nombre_normalizado,
    };
  });
  next();
});

// Crear y exportar el modelo
const Analitica = mongoose.model("Analitica", analiticaSchema);
module.exports = Analitica;
