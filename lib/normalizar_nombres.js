const mongoose = require("mongoose");
const { normalizeStringAndFixSomeNames } = require("./utils");

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

// Conectar a MongoDB
mongoose.connect(
  "mongodb+srv://ricardovelero:uPAJHGx24Wh22jFV@cluster0.obic4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const Analitica = mongoose.model("Analitica", analiticaSchema);

// Función para actualizar todos los documentos con nombre_normalizado
async function actualizarAnaliticas() {
  try {
    const analiticas = await Analitica.find({});

    for (let doc of analiticas) {
      const resultadosNormalizados = doc.resultados.map((resultado) => ({
        ...resultado,
        nombre_normalizado: normalizeStringAndFixSomeNames(resultado.nombre),
      }));

      await Analitica.updateOne(
        { _id: doc._id },
        { $set: { resultados: resultadosNormalizados } }
      );
    }

    console.log("Actualización completada.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error actualizando:", error);
    mongoose.disconnect();
  }
}

// Ejecutar la actualización
actualizarAnaliticas();
