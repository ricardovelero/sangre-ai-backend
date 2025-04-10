const request = require("supertest");
const http = require("http");
const mongoose = require("mongoose");
const app = require("../app");

describe("Servidor Express", () => {
  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done); // Espera a que se levante el servidor antes de correr los tests
  });

  test("Debería responder en la ruta raíz", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('{"message":"API funcionando correctamente 🚀"}');
  });

  afterAll(async () => {
    // Cierra el servidor y la conexión a la BD para limpiar los handles abiertos
    server.close();
    await mongoose.connection.close();
  });
});
