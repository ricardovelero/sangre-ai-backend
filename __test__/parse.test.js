const fs = require("fs");
const {
  guardarAnalitica,
  normalizarAnalitica,
} = require("../controllers/upload.controller");
const { default: mongoose } = require("mongoose");

const mockUserId = "6613e123abcde12345678901"; // un ObjectId de ejemplo válido
const mockResponseFile = "./__mocks__/mock_respuesta.txt";

describe("Parseo y guardado de analítica", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI); // usa tu cadena de conexión a MongoDB
  });

  afterAll(async () => {
    await mongoose.disconnect();
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
        expect.objectContaining({ nombre_normalizado: "colesterol no hdl" }),
      ])
    );

    const resultado = await guardarAnalitica(markdown, json, mockUserId);

    expect(resultado).toBeDefined();
    expect(resultado.resultados.length).toBeGreaterThan(0);
  });
});
