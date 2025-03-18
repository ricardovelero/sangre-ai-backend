const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Make sure this path matches your app file location
require("dotenv").config();

jest.mock("../middleware/auth"); // Mockear el middleware de autenticación

describe("Un Test básico", () => {
  beforeAll(async () => {
    // Conectar a la base de datos antes de ejecutar los tests
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Cerrar la conexión a MongoDB después de ejecutar los tests
    await mongoose.connection.close();
  });

  describe("API Endpoints", () => {
    test("GET / should return 200 OK", async () => {
      const response = await request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("message");
    });
  });
});
