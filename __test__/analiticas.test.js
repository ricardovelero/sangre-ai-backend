const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../server");
const Analitica = require("../models/analitica.model");
require("dotenv").config();

// Use the same user ID that works in Thunder Client
const TEST_USER_ID = "65f1e8afd91baac7eb38d5cc"; // Replace this with your working user ID

// Mock the auth middleware directly
jest.mock("../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    console.log("🔑 Mock auth middleware called");
    req.userData = { id: TEST_USER_ID };
    next();
  });
});

describe("Test API de Analíticas", () => {
  beforeAll(async () => {
    console.log("🚀 Starting tests...");

    // Create test data
    try {
      const testDataWithSeries = {
        markdown: "Test data with series",
        datos_analitica: {
          paciente: {
            fecha_toma_muestra: new Date(),
          },
          analitica: {
            serie_blanca: {
              leucocitos: 7000,
              neutrofilos: 60,
              linfocitos: 30,
            },
          },
        },
        owner: TEST_USER_ID,
      };

      const testDataWithoutSeries = {
        markdown: "Test data without series",
        datos_analitica: {
          paciente: {
            fecha_toma_muestra: new Date(),
          },
          analitica: {
            // No series data
          },
        },
        owner: TEST_USER_ID,
      };

      await Analitica.create([testDataWithSeries, testDataWithoutSeries]);
      console.log("✅ Test data created successfully");
    } catch (error) {
      console.error("❌ Error creating test data:", error);
    }
  });

  afterAll(async () => {
    try {
      // Clean up test data
      await Analitica.deleteMany({ owner: TEST_USER_ID });
      console.log("✅ Test data cleaned up");

      // Cerrar el servidor Express
      await new Promise((resolve) => server.close(resolve));
      console.log("✅ Servidor Express cerrado");
    } catch (error) {
      console.error("❌ Error in cleanup:", error);
    }
  });

  // ✅ 1. Prueba para obtener la serie blanca
  test("Debe obtener la serie blanca", async () => {
    console.log("🔍 Iniciando test de serie blanca...");

    const res = await request(app).get(
      `/api/analitica/series?tipo=serie-blanca`
    );

    console.log("📡 Respuesta recibida:", JSON.stringify(res.body, null, 2));
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("valores.leucocitos");
  });

  // ✅ 2. Prueba para un tipo de serie inválido
  test("Debe devolver error 400 si el tipo de serie no es válido", async () => {
    const res = await request(app).get(
      `/api/analitica/series?tipo=tipo-invalido`
    );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Tipo de serie no válido");
  });

  // ✅ 3. Prueba cuando no hay datos en la base de datos
  test("Debe devolver array vacío si no hay datos en la base de datos", async () => {
    // Primero limpiamos todos los datos
    await Analitica.deleteMany({ owner: TEST_USER_ID });

    const res = await request(app).get(`/api/analitica/series?tipo=serie-roja`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  // ✅ 4. Prueba cuando existe analítica pero no tiene la serie solicitada
  test("Debe devolver array vacío si existe analítica pero no tiene la serie solicitada", async () => {
    const res = await request(app).get(`/api/analitica/series?tipo=serie-roja`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  // ✅ 5. Prueba si falta el parámetro `tipo`
  test("Debe devolver error 400 si falta el query parameter `tipo`", async () => {
    const res = await request(app).get(`/api/analitica/series`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Debe proporcionar un tipo de serie válido");
  });

  // ✅ 6. Prueba de error interno del servidor (simulando fallo de MongoDB)
  test("Debe devolver 500 si hay un error en la base de datos", async () => {
    // Simular un error en la base de datos
    jest
      .spyOn(mongoose.Model, "aggregate")
      .mockRejectedValue(new Error("Test de Fallo en MongoDB"));

    const res = await request(app).get(`/api/analitica/series?tipo=lipidos`);

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Error al obtener la serie/);
  });
});
