require("dotenv").config();
const db = require("../models");
const Analitica = db.Analitica;
const mongoose = require("mongoose");
const fs = require("fs");
const calculateAdditionalResults = require("./calculations");

async function agregarAnalitosDerivados() {
  console.log("Conectado a MongoDB");

  const isDryRun = process.argv.includes("--dry-run");
  console.log(
    isDryRun
      ? "Ejecución en modo DRY RUN (sin guardar cambios)"
      : "Ejecución en modo NORMAL (guardando cambios)"
  );

  const analiticas = await Analitica.find({});
  console.log(`Procesando ${analiticas.length} analíticas...`);

  for (const analitica of analiticas) {
    const resultados = analitica.resultados || [];

    const nuevos = calculateAdditionalResults(resultados).filter(
      (r) =>
        !resultados.some(
          (orig) => orig.nombre_normalizado === r.nombre_normalizado
        )
    );

    if (nuevos.length > 0) {
      resultados.push(...nuevos);

      const logEntry = `[${new Date().toISOString()}] Analítica ${
        analitica._id
      }:\n  ${nuevos
        .map((r) => `Añadido ${r.nombre_normalizado}: ${r.valor}`)
        .join("\n  ")}\n`;

      fs.appendFileSync("lib/analiticas.log", logEntry);

      if (!isDryRun) {
        analitica.resultados = resultados;
        await analitica.save();
      }

      console.log(`Actualizada analítica ${analitica._id}`);
    }
  }

  await mongoose.disconnect();
  console.log("Proceso finalizado y desconectado.");
}

agregarAnalitosDerivados().catch(console.error);
