const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../server");
const Analitica = require("../models/analitica.model");
require("dotenv").config();

// Mock auth middleware
jest.mock("../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.userData = { id: "65f1e8afd91baac7eb38d5cc" }; // Test user ID
    next();
  });
});

describe("Notes API Endpoints", () => {
  const TEST_USER_ID = "65f1e8afd91baac7eb38d5cc";
  let testAnaliticaId;

  // Setup test data before running tests
  beforeAll(async () => {
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

  // Clean up after tests
  afterAll(async () => {
    await Analitica.deleteMany({ owner: TEST_USER_ID });
    await server.close();
    await mongoose.connection.close();
  });

  // Test creating a note
  describe("POST /api/analitica/:analiticaId/notes", () => {
    test("should create a new note", async () => {
      const res = await request(app)
        .post(`/api/analitica/${testAnaliticaId}/notes`)
        .send({
          content: "Test note content",
        });

      console.log("res", res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("content", "Test note content");
      expect(res.body).toHaveProperty("owner", TEST_USER_ID);
    });

    test("should return 404 for non-existent analitica", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/analitica/${fakeId}/notes`)
        .send({
          content: "Test note content",
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Analitica no encontrada");
    });
  });

  // Test getting all notes
  describe("GET /api/analitica/:analiticaId/notes", () => {
    test("should get all notes for an analitica", async () => {
      const res = await request(app).get(
        `/api/analitica/${testAnaliticaId}/notes`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("should return 404 for non-existent analitica", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/analitica/${fakeId}/notes`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Analitica no encontrada");
    });
  });

  // Test getting a specific note
  describe("GET /api/analitica/:analiticaId/notes/:noteId", () => {
    let testNoteId;

    beforeAll(async () => {
      // Create a test note to use in tests
      const analitica = await Analitica.findById(testAnaliticaId);
      analitica.notas.push({
        content: "Test note for specific retrieval",
        owner: TEST_USER_ID,
      });
      await analitica.save();
      testNoteId = analitica.notas[0]._id;
    });

    test("should get a specific note", async () => {
      const res = await request(app).get(
        `/api/analitica/${testAnaliticaId}/notes/${testNoteId}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("content", "Test note content");
    });

    test("should return 404 for non-existent note", async () => {
      const fakeNoteId = new mongoose.Types.ObjectId();
      const res = await request(app).get(
        `/api/analitica/${testAnaliticaId}/notes/${fakeNoteId}`
      );

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Nota no encontrada");
    });
  });

  // Test updating a note
  describe("PUT /api/analitica/:analiticaId/notes/:noteId", () => {
    let testNoteId;

    beforeAll(async () => {
      // Create a test note to update
      const analitica = await Analitica.findById(testAnaliticaId);
      analitica.notas.push({
        content: "Original content",
        owner: TEST_USER_ID,
      });
      await analitica.save();
      testNoteId = analitica.notas[analitica.notas.length - 1]._id;
    });

    test("should update a note", async () => {
      const res = await request(app)
        .put(`/api/analitica/${testAnaliticaId}/notes/${testNoteId}`)
        .send({
          content: "Updated content",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("content", "Updated content");
    });
  });

  // Test deleting a note
  describe("DELETE /api/analitica/:analiticaId/notes/:noteId", () => {
    let testNoteId;

    beforeAll(async () => {
      // Create a test note to delete
      const analitica = await Analitica.findById(testAnaliticaId);
      analitica.notas.push({
        content: "Note to delete",
        owner: TEST_USER_ID,
      });
      await analitica.save();
      testNoteId = analitica.notas[analitica.notas.length - 1]._id;
    });

    test("should delete a note", async () => {
      const res = await request(app).delete(
        `/api/analitica/${testAnaliticaId}/notes/${testNoteId}`
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Nota eliminada correctamente"
      );

      // Verify note was actually deleted
      const analitica = await Analitica.findById(testAnaliticaId);
      const deletedNote = analitica.notas.id(testNoteId);
      expect(deletedNote).toBeNull();
    });
  });
});
