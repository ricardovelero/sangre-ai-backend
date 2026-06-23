// Garantiza modo test ANTES de cargar dotenv o cualquier modelo, para que
// models/index.js no se conecte nunca a la base de datos real.
process.env.NODE_ENV = "test";

require("dotenv").config(); // Cargar variables de entorno

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Una única base de datos en memoria para toda la suite de tests.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Cinturón y tirantes: si por cualquier motivo la conexión no apunta a la
  // base de datos en memoria (localhost), abortamos toda la suite para no
  // tocar jamás una base de datos real (p. ej. MongoDB Atlas).
  const host = mongoose.connection.host;
  const isLocal = host === "127.0.0.1" || host === "localhost" || host === "::1";
  if (!isLocal) {
    await mongoose.disconnect();
    await mongoServer.stop();
    throw new Error(
      `🛑 Conexión de test no segura: se esperaba una BD en memoria (localhost) ` +
        `pero se conectó a "${host}". Tests abortados para proteger datos reales.`,
    );
  }
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);
