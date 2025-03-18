require("dotenv").config();
const db = require("./models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");
const ss = require("simple-statistics");

async function calcularRegresionColesterol(owner) {
  const data = await Analitica.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(owner), // Asegurar que pertenece al usuario autenticado
      },
    },
    {
      $project: {
        _id: 0,
        fecha: { $toDate: "$datos_analitica.paciente.fecha_toma_muestra" }, // Convertir a Date
        colesterol_total:
          "$datos_analitica.analitica.bioquimica_clinica.colesterol_total",
        HDL: "$datos_analitica.analitica.bioquimica_clinica.HDL",
        LDL: "$datos_analitica.analitica.bioquimica_clinica.LDL",
        trigliceridos:
          "$datos_analitica.analitica.bioquimica_clinica.trigliceridos",
      },
    },
    {
      $match: {
        fecha: { $ne: null }, // Filtrar documentos sin fecha
        colesterol_total: { $ne: null }, // Filtrar datos sin colesterol
      },
    },
    {
      $sort: { fecha: 1 }, // Ordenar por fecha ascendente (para regresión)
    },
    {
      $limit: 10, // Obtener las últimas 10 muestras (puedes cambiarlo según necesidad)
    },
  ]);

  if (!data.length) {
    console.error("No hay datos disponibles para este usuario.");
    return null;
  }

  console.log(data);

  const primeraFecha = data[0].fecha.getTime();
  const puntos = data.map((d) => [
    (d.fecha.getTime() - primeraFecha) / (1000 * 60 * 60 * 24), // Días desde el primer análisis
    d.colesterol_total,
  ]);

  const regresion = ss.linearRegression(puntos);
  const linea = ss.linearRegressionLine(regresion);

  //   console.log({
  //     ecuacion: `y = ${regresion.m.toFixed(2)}x + ${regresion.b.toFixed(2)}`,
  //     pendiente: regresion.m.toFixed(2),
  //     intercepto: regresion.b.toFixed(2),
  //     prediccion_30_dias: linea(30).toFixed(2),
  //   });

  return {
    ecuacion: `y = ${regresion.m.toFixed(2)}x + ${regresion.b.toFixed(2)}`,
    pendiente: regresion.m.toFixed(2),
    intercepto: regresion.b.toFixed(2),
    prediccion_365_dias: linea(365).toFixed(2), // Predicción en 30 días
  };
}

// Ejemplo de uso
calcularRegresionColesterol("67d01e8afd91baac7eb38d5c").then(console.log);
