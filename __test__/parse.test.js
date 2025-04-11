const fs = require("fs");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  guardarAnalitica,
  normalizarAnalitica,
} = require("../controllers/upload.controller");
const Analitica = require("../models/analitica.model");

const mockUserId = "6613e123abcde12345678901"; // un ObjectId de ejemplo válido
const mockResponseFile = "./__mocks__/mock_respuesta.txt";

describe("Parseo y guardado de analítica", () => {
  let mongoServer;

  beforeAll(async () => {
    // Inicializa una instancia de MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("debería parsear y guardar la analítica correctamente desde un mock", async () => {
    const texto = fs
      .readFileSync(mockResponseFile, "utf-8")
      .replace(/^\uFEFF/, "");

    // Usamos las funciones de extracción del controlador
    const {
      extractMarkdown,
      extractJSON,
    } = require("../controllers/upload.controller");

    const markdown = extractMarkdown(texto);
    const json = extractJSON(texto);

    const normalizedAnalitica = normalizarAnalitica(json);

    expect(json).toBeDefined();
    expect(json.resultados).toBeInstanceOf(Array);

    expect(normalizarAnalitica).toBeDefined();
    expect(normalizedAnalitica.resultados).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nombre_normalizado: "ldl" }),
      ])
    );

    const resultado = await guardarAnalitica(markdown, json, mockUserId);

    expect(resultado).toBeDefined();
    expect(resultado.resultados.length).toBeGreaterThan(0);

    await Analitica.deleteOne(resultado._id);
  });
});
