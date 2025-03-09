const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const db = {};
const modelsPath = __dirname;

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("📦 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Cargar todos los modelos dinámicamente
fs.readdirSync(modelsPath)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const model = require(path.join(modelsPath, file));
    db[model.modelName] = model;
  });

console.log("📒 Modelos cargados:", Object.keys(db));

// Exportar los modelos y la conexión
db.mongoose = mongoose;
module.exports = db;
