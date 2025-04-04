const request = require("supertest");
const http = require("http");
const app = require("../app"); // ajusta ruta si es necesario

describe("Servidor Express", () => {
  let server;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done); // espera a que se levante antes de correr los tests
  });

  afterAll((done) => {
    server.close(done); // cierra el servidor cuando terminen los tests
  });

  test("Debería responder en la ruta raíz", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('{"message":"API funcionando correctamente 🚀"}');
  });
});
