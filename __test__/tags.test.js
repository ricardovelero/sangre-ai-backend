// __tests__/tags.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Tag = require("../models/tag.model");
const Analitica = require("../models/analitica.model");
require("dotenv").config();

// Mock auth middleware
jest.mock("../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.userData = { id: "65f1e8afd91baac7eb38d5cc" }; // Test user ID
    next();
  });
});

describe("Tags API Endpoints", () => {
  const TEST_USER_ID = "65f1e8afd91baac7eb38d5cc";

  beforeEach(async () => {
    // Create a test analitica
    const testAnalitica = await Analitica.create({
      owner: TEST_USER_ID,
      paciente: {
        nombre: "Test paciente",
      },
      fecha_toma_muestra: new Date(),
      markdown: "Test analitica",
      resultados: [],
      notas: [], // Start with empty notes array
    });
    testAnaliticaId = testAnalitica._id;
  });

  afterAll(async () => {
    await Tag.deleteMany({ owner: TEST_USER_ID });
    await Analitica.deleteMany({ owner: TEST_USER_ID });
    await mongoose.connection.close();
  });

  // Test creating a tag
  describe("POST /api/tags", () => {
    afterAll(async () => {
      await Tag.deleteMany({ owner: TEST_USER_ID });
    });
    test("should create a new tag", async () => {
      const res = await request(app).post("/api/tags").send({
        name: "Test Tag",
        analiticaId: testAnaliticaId,
      });

      const { tag } = res.body;

      expect(res.status).toBe(201);
      expect(tag).toHaveProperty("name", "test tag");
      expect(tag).toHaveProperty("owner", TEST_USER_ID);
    });

    test("should not create duplicate tag for same user", async () => {
      // Create first tag
      await request(app).post("/api/tags").send({
        name: "Test Tag",
        analiticaId: testAnaliticaId,
      });

      // Try to create duplicate
      const res = await request(app).post("/api/tags").send({
        name: "Test Tag",
        analiticaId: testAnaliticaId,
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Etiqueta ya incluida en analitica"
      );
    });
  });

  // Test getting all tags
  describe("GET /api/tags", () => {
    beforeEach(async () => {
      // Create some test tags
      await Tag.create([
        { name: "tag1", owner: TEST_USER_ID },
        { name: "tag2", owner: TEST_USER_ID },
      ]);
    });

    test("should get all tags for user", async () => {
      const res = await request(app).get("/api/tags");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty("name");
    });
  });

  // Test getting a specific tag
  describe("GET /api/tags/:tagId", () => {
    let testTagId;

    beforeEach(async () => {
      // Create a test tag and analitica
      const tag = await Tag.create({
        name: "tag 3",
        owner: TEST_USER_ID,
      });
      testTagId = tag._id;

      await Analitica.create({
        paciente: {
          nombre: "Test paciente",
        },
        markdown: "Test analitica",
        owner: TEST_USER_ID,
        tags: [testTagId],
        fecha_toma_muestra: new Date(),
      });
    });

    afterEach(async () => {
      await Tag.deleteMany({ owner: TEST_USER_ID });
    });

    test("should get a specific tag and its analytics", async () => {
      const res = await request(app).get(`/api/tags/${testTagId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("tag");
      expect(res.body).toHaveProperty("analiticas");
      expect(Array.isArray(res.body.analiticas)).toBe(true);
      expect(res.body.analiticas).toHaveLength(1);
    });

    test("should return 404 for non-existent tag", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/tags/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Etiqueta no encontrada");
    });
  });

  // Test deleting a tag
  describe("DELETE /api/tags/:tagId", () => {
    let testTagId;

    beforeEach(async () => {
      // Create a test tag and analitica with this tag
      const tag = await Tag.create({
        name: "tag to delete",
        owner: TEST_USER_ID,
      });
      testTagId = tag._id;

      await Analitica.create({
        paciente: {
          nombre: "Test paciente",
        },
        markdown: "Test analitica",
        owner: TEST_USER_ID,
        tags: [testTagId],
        fecha_toma_muestra: new Date(),
      });
    });

    test("should delete a tag and remove references", async () => {
      const res = await request(app).delete(`/api/tags/${testTagId}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Etiqueta eliminada correctamente"
      );

      // Verify tag was deleted
      const deletedTag = await Tag.findById(testTagId);
      expect(deletedTag).toBeNull();

      // Verify tag reference was removed from analiticas
      const analitica = await Analitica.findOne({ owner: TEST_USER_ID });
      expect(analitica.tags).not.toContain(testTagId);
    });

    test("should return 404 for non-existent tag", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/tags/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Etiqueta no encontrada");
    });
  });
});
