const Analitica = require("../models/analitica.model");
const { getMockAnalitica } = require("../__mocks__/analitica.mock");

describe("Analitica Model", () => {
  let testAnalitica;
  let savedAnalitica;

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

  test('debe agregar el resultado "tg_hdl_ratio" al guardar la analítica cuando se proporcionan Trigliceridos y HDL', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "tg_hdl_ratio"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBe(2);
  });

  test('debe agregar el resultado "homa_ir" al guardar la analítica cuando se proporcionan Glucosa e Insulina', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "homa_ir"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBeCloseTo(2.2222, 4);
  });

  test('debe agregar el resultado "eag" al guardar la analítica cuando se proporciona Hemoglobina A1C', async () => {
    const calculatedResult = savedAnalitica.resultados.find(
      (r) => r.nombre_normalizado === "eag"
    );
    expect(calculatedResult).toBeDefined();
    expect(calculatedResult.valor).toBeCloseTo(108.28, 2);
  });
});
