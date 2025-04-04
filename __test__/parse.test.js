const fs = require("fs");
const path = require("path");
const { guardarAnalitica } = require("../controllers/upload.controller"); // asegúrate que esté exportada
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
    const texto = fs.readFileSync(mockResponseFile, "utf-8");

    console.log(texto.includes("```json")); // ¿true?

    // Usamos las funciones de extracción del controlador
    const {
      extractMarkdown,
      extractJSON,
    } = require("../controllers/upload.controller");

    const markdown = extractMarkdown(texto);
    const json = extractJSON(texto);

    console.log(json);

    expect(json).toBeDefined();
    expect(json.resultados).toBeInstanceOf(Array);

    const resultado = await guardarAnalitica(markdown, json, mockUserId);

    expect(resultado).toBeDefined();
    expect(resultado.resultados.length).toBeGreaterThan(0);
  });
});
