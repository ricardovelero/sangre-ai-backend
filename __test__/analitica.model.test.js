const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Analitica = require("../models/analitica.model");

const TEST_USER_ID = "65f1e8afd91baac7eb38d5cc";

describe("Analitica Model", () => {
  let mongoServer;

  beforeAll(async () => {
    // Inicializa una instancia de MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpia la colección para aislar cada test
    await Analitica.deleteMany({});
  });

  test('debe agregar el resultado "colesterol no hdl" al guardar la analítica cuando se proporcionan LDL y HDL', async () => {
    // Arrange: crea un documento de analítica con resultados de "Colesterol LDL" y "HDL"
    const testAnalitica = new Analitica({
      paciente: { nombre: "Test paciente" },
      fecha_toma_muestra: new Date(),
      fecha_informe: new Date(),
      laboratorio: "Test Lab",
      medico: "Dr. Test",
      markdown: "Test markdown",
      resumen: "Test resumen",
      resultados: [
        {
          nombre: "Colesterol LDL",
          valor: "150",
          unidad: "mg/dL",
          nombre_normalizado: "ldl",
        },
        {
          nombre: "HDL",
          valor: "50",
          unidad: "mg/dL",
          nombre_normalizado: "hdl",
        },
      ],
      owner: TEST_USER_ID,
    });

    // Act: guarda el documento y deja que el hook pre‑save haga su trabajo
    const savedAnalitica = await testAnalitica.save();

    // Assert: se debe haber agregado un resultado cuyo nombre_normalizado sea "colesterol no hdl"
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "colesterol no hdl"
    );
    expect(calculatedResult).toBeDefined();
    // Verifica que el valor sea correcto: 150 - 50 = 100
    expect(calculatedResult.valor).toBe(100);
  });
});
