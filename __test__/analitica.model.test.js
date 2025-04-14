const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Analitica = require("../models/analitica.model");
const { getMockAnalitica } = require("../__mocks__/analitica.mock");

describe("Analitica Model", () => {
  let mongoServer;
  let testAnalitica;
  let savedAnalitica;

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

  beforeEach(async () => {
    testAnalitica = new Analitica(getMockAnalitica());
    savedAnalitica = await testAnalitica.save();
  });

  test('debe agregar el resultado "colesterol no hdl" al guardar la analítica cuando se proporcionan Colesterol Total y HDL', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "colesterol no hdl"
    );
    expect(calculatedResult).toBeDefined();
    // Verifica que el valor sea correcto: 200 - 50 = 150
    expect(calculatedResult.valor).toBe(150);
  });

  test('debe agregar el resultado "total/hdl" al guardar la analítica cuando se proporcionan Colesterol Total y HDL', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "total/hdl"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBe(4);
  });

  test('debe agregar el resultado "trigliceridos/hdl" al guardar la analítica cuando se proporcionan Trigliceridos y HDL', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "trigliceridos/hdl"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBe(2);
  });

  test('debe agregar el resultado "ldl/hdl" al guardar la analítica cuando se proporcionan LDL y HDL', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "ldl/hdl"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBe(3.2);
  });
});
