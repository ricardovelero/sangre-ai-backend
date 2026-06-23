const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const db = {};
const modelsPath = __dirname;

// Conectar a MongoDB.
// En tests (NODE_ENV=test) la conexión la gestiona jest.setup.js contra una
// base de datos en memoria, para no tocar nunca la base de datos real.
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    })
    .then(() => console.log("📦 Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
}

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
