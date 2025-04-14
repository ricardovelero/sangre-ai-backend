require("dotenv").config();
const db = require("../models");
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
        fecha: { $toDate: "$fecha_toma_muestra" }, // Convertir a Date
        resultados: 1,
      },
    },
    {
      $match: {
        fecha: { $ne: null }, // Filtrar documentos sin fecha
      },
    },
    {
      $sort: { fecha: 1 }, // Ordenar por fecha ascendente (para regresión)
    },
    {
      $limit: 10, // Obtener las últimas 10 muestras (puedes cambiarlo según necesidad)
    },
  ]);

  const dataFiltrada = data.map((entry) => {
    const colesterolTotal = entry.resultados.find(
      (r) => r.nombre_normalizado === "colesterol total"
    );
    return {
      fecha: entry.fecha,
      colesterol_total: colesterolTotal ? Number(colesterolTotal.valor) : null,
    };
  }).filter((entry) => entry.colesterol_total !== null);

  if (!dataFiltrada.length) {
    console.error("No hay datos disponibles para este usuario.");
    return null;
  }

  console.log(dataFiltrada);

  const primeraFecha = dataFiltrada[0].fecha.getTime();
  const puntos = dataFiltrada.map((d) => [
    (d.fecha.getTime() - primeraFecha) / (1000 * 60 * 60 * 24),
    d.colesterol_total,
  ]);

  const regresion = ss.linearRegression(puntos);
  const linea = ss.linearRegressionLine(regresion);

  return {
    ecuacion: `y = ${regresion.m.toFixed(2)}x + ${regresion.b.toFixed(2)}`,
    pendiente: regresion.m.toFixed(2),
    intercepto: regresion.b.toFixed(2),
    prediccion_365_dias: linea(365).toFixed(2), // Predicción en 30 días
  };
}

// Ejemplo de uso
calcularRegresionColesterol("67d01e8afd91baac7eb38d5c").then(console.log);
