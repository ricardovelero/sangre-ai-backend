const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Analitica = require("../models/analitica.model");
require("dotenv").config();

const TEST_USER_ID = "65f1e8afd91baac7eb38d5cc";

// Mock the auth middleware directly
jest.mock("../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    console.log("🔑 Mock auth middleware called");
    req.userData = { id: TEST_USER_ID };
    next();
  });
});

beforeAll(async () => {
  console.log("🚀 Starting tests...");

  // Create test data
  try {
    const testDataWithSeries = {
      paciente: {
        nombre: "Test paciente",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test data with series",
      resultados: [],
      owner: TEST_USER_ID,
    };

    const testDataWithoutSeries = {
      paciente: {
        nombre: "Test paciente",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test data with series",
      resultados: [
        {
          nombre: "Colesterol",
          valor: 100,
          unidad: "mg/dL",
          rango_referencia: {
            minimo: 50,
            maximo: 110,
          },
          indicador: "normal",
          observaciones: "Test observaciones",
          nombre_normalizado: "colesterol",
        },
        {
          nombre: "Leucocitos",
          valor: 100,
          unidad: "mg/dL",
          rango_referencia: {
            minimo: 50,
            maximo: 110,
          },
          indicador: "normal",
          observaciones: "Test observaciones",
          nombre_normalizado: "leucocitos",
        },
      ],
      owner: TEST_USER_ID,
    };

    const testDataGlucosaMetabolica = {
      paciente: {
        nombre: "Test paciente",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test data glucosa metabolica",
      resultados: [
        {
          nombre: "Glucosa",
          valor: 90,
          unidad: "mg/dL",
        },
        {
          nombre: "Hemoglobina A1C",
          valor: 5.4,
          unidad: "%",
        },
        {
          nombre: "Insulina",
          valor: 10,
          unidad: "uU/mL",
        },
        {
          nombre: "Glucosa 2h",
          valor: 120,
          unidad: "mg/dL",
        },
        {
          nombre: "Triglicéridos",
          valor: 100,
          unidad: "mg/dL",
        },
        {
          nombre: "HDL",
          valor: 50,
          unidad: "mg/dL",
        },
      ],
      owner: TEST_USER_ID,
    };

    await Analitica.create([
      testDataWithSeries,
      testDataWithoutSeries,
      testDataGlucosaMetabolica,
    ]);
    console.log("✅ Test data created successfully");
  } catch (error) {
    console.error("❌ Error creating test data:", error);
  }
});

afterAll(async () => {
  // Guard: this top-level afterAll can run after jest.setup.js has already
  // disconnected the shared in-memory connection. Skip cleanup if so.
  if (mongoose.connection.readyState === 1) {
    await Analitica.deleteMany({ owner: TEST_USER_ID });
  }
});

describe("Test API de Analíticas", () => {
  // ✅ 1. Prueba para obtener la serie blanca
  test("Debe obtener la serie blanca", async () => {
    console.log("🔍 Iniciando test de serie blanca...");

    const res = await request(app).get(
      `/api/analitica/series?tipo=serie-blanca`
    );

    console.log("📡 Respuesta recibida:", JSON.stringify(res.body, null, 2));
    expect(res.status).toBe(200);
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0]).toHaveProperty("resultados");
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
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toHaveLength(0);
  });

  // ✅ 4. Prueba cuando existe analítica pero no tiene la serie solicitada
  test("Debe devolver array vacío si existe analítica pero no tiene la serie solicitada", async () => {
    const res = await request(app).get(`/api/analitica/series?tipo=serie-roja`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results).toHaveLength(0);
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
    const aggregateSpy = jest
      .spyOn(mongoose.Model, "aggregate")
      .mockRejectedValue(new Error("Test de Fallo en MongoDB"));

    const res = await request(app).get(`/api/analitica/series?tipo=lipidos`);

    expect(res.status).toBe(500);
    aggregateSpy.mockRestore();
  });

  // ✅ 7. Prueba para la serie glucosa-metabolica
  test("Debe obtener la serie glucosa-metabolica", async () => {
    await Analitica.create({
      paciente: {
        nombre: "Test paciente",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test data glucosa metabolica",
      resultados: [
        {
          nombre: "Glucosa",
          valor: 90,
          unidad: "mg/dL",
        },
        {
          nombre: "Hemoglobina A1C",
          valor: 5.4,
          unidad: "%",
        },
        {
          nombre: "Insulina",
          valor: 10,
          unidad: "uU/mL",
        },
        {
          nombre: "Glucosa 2h",
          valor: 120,
          unidad: "mg/dL",
        },
        {
          nombre: "Triglicéridos",
          valor: 100,
          unidad: "mg/dL",
        },
        {
          nombre: "HDL",
          valor: 50,
          unidad: "mg/dL",
        },
      ],
      owner: TEST_USER_ID,
    });

    const res = await request(app).get(
      `/api/analitica/series?tipo=glucosa-metabolica`
    );

    expect(res.status).toBe(200);
    expect(res.body.parameters).toEqual([
      "glucosa",
      "hemoglobina_glicosilada_a1c",
      "insulina",
      "homa_ir",
      "tg_hdl_ratio",
      "glucosa_2h",
      "eag",
    ]);
    expect(res.body.results).toBeInstanceOf(Array);
    expect(res.body.results.length).toBeGreaterThan(0);

    const serieEntry = res.body.results.find(
      (entry) =>
        Array.isArray(entry.resultados) &&
        entry.resultados.some((r) => r.nombre_normalizado === "glucosa")
    );

    expect(serieEntry).toBeDefined();
    const nombres = serieEntry.resultados.map((r) => r.nombre_normalizado);
    expect(nombres).toEqual(
      expect.arrayContaining([
        "glucosa",
        "hemoglobina_glicosilada_a1c",
        "insulina",
        "homa_ir",
        "tg_hdl_ratio",
        "glucosa_2h",
        "eag",
      ])
    );
  });
});

// Test getting all analiticas
describe("GET /api/analitica", () => {
  let testAnaliticaId;

  beforeAll(async () => {
    const testAnalitica = await Analitica.create({
      paciente: {
        nombre: "Test paciente single",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test single analitica",
      resultados: [],
      owner: TEST_USER_ID,
    });
    testAnaliticaId = testAnalitica._id;
  });
  test("Debe obtener todas las analíticas del usuario", async () => {
    const res = await request(app).get("/api/analitica");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("markdown");
    expect(res.body[0]).toHaveProperty("owner", TEST_USER_ID);
  });
});

// Test getting a single analitica
describe("GET /api/analitica/:id", () => {
  let testAnaliticaId;

  beforeAll(async () => {
    const testAnalitica = await Analitica.create({
      paciente: {
        nombre: "Test paciente single",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test single analitica",
      resultados: [],
      owner: TEST_USER_ID,
    });
    testAnaliticaId = testAnalitica._id;
  });

  test("Debe obtener una analítica específica", async () => {
    const res = await request(app).get(`/api/analitica/${testAnaliticaId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", testAnaliticaId.toString());
    expect(res.body).toHaveProperty("markdown", "Test single analitica");
  });

  test("Debe devolver 404 si la analítica no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/analitica/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Analitica no encontrada.");
  });

  test("Debe devolver 400 si el ID no es válido", async () => {
    const res = await request(app).get("/api/analitica/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "ID de analítica no válido");
  });
});

// Test deleting an analitica
describe("DELETE /api/analitica/:id", () => {
  let testAnaliticaId;

  beforeEach(async () => {
    const testAnalitica = await Analitica.create({
      paciente: {
        nombre: "Test paciente to delete",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test analitica to delete",
      resultados: [],
      owner: TEST_USER_ID,
    });
    testAnaliticaId = testAnalitica._id;
  });

  test("Debe eliminar una analítica", async () => {
    const res = await request(app).delete(`/api/analitica/${testAnaliticaId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Analitica eliminada correctamente."
    );

    // Verify it was actually deleted
    const deletedAnalitica = await Analitica.findById(testAnaliticaId);
    expect(deletedAnalitica).toBeNull();
  });

  test("Debe devolver 404 si la analítica a eliminar no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/analitica/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Analitica no encontrada.");
  });

  test("Debe devolver 400 si el ID no es válido", async () => {
    const res = await request(app).delete("/api/analitica/invalid-id");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "ID de analítica no válido");
  });
});

// Test updating an analitica
describe("PUT /api/analitica/:id", () => {
  let testAnaliticaId;

  beforeEach(async () => {
    const testAnalitica = await Analitica.create({
      paciente: {
        nombre: "Test paciente original",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test analitica original",
      laboratorio: "Lab original",
      medico: "Dr. Original",
      resultados: [],
      owner: TEST_USER_ID,
    });
    testAnaliticaId = testAnalitica._id;
  });

  test("Debe actualizar una analítica", async () => {
    const updateData = {
      laboratorio: "Lab actualizado",
      medico: "Dr. Actualizado",
      nombre: "Paciente actualizado",
      apellidos: "Apellidos actualizados",
      fecha_toma_muestra: new Date(),
    };

    const res = await request(app)
      .put(`/api/analitica/${testAnaliticaId}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("laboratorio", "Lab actualizado");
    expect(res.body).toHaveProperty("medico", "Dr. Actualizado");
    expect(res.body.paciente).toHaveProperty("nombre", "Paciente actualizado");
  });

  test("Debe devolver 404 si la analítica a actualizar no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/analitica/${fakeId}`)
      .send({ laboratorio: "Lab test" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Analitica no encontrada.");
  });

  test("Debe devolver 400 si el ID no es válido", async () => {
    const res = await request(app)
      .put("/api/analitica/invalid-id")
      .send({ laboratorio: "Lab test" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "ID de analítica no válido");
  });
});
