const calculateAdditionalResults = require("../lib/calculations");

describe("calculateAdditionalResults", () => {
  test('debe calcular "Colesterol no HDL" correctamente cuando se proporcionan valores numéricos válidos para "Colesterol Total" y "HDL"', () => {
    const resultadosOriginales = [
      { nombre_normalizado: "colesterol total", valor: "200" },
      { nombre_normalizado: "hdl", valor: "50" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);

    expect(resultadosCalculados).toEqual([
      {
        nombre: "Colesterol no HDL",
        codigo_loic: "9840-7",
        valor: 150,
        unidad: "mg/dL",
        nombre_normalizado: "colesterol no hdl",
      },
      {
        nombre: "Colesterol Total / HDL",
        codigo_loic: "9833-5",
        valor: 4,
        unidad: null,
        nombre_normalizado: "total/hdl",
      },
    ]);
  });

  test("debe devolver un array vacío si falta el resultado de 'Colesterol LDL'", () => {
    const resultadosOriginales = [{ nombre_normalizado: "hdl", valor: "50" }];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });

  test("debe devolver un array vacío si falta el resultado de 'HDL'", () => {
    const resultadosOriginales = [
      { nombre_normalizado: "colesterol total", valor: "130" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });

  test("no debe calcular si los valores no son números válidos", () => {
    const resultadosOriginales = [
      { nombre_normalizado: "colesterol total", valor: "abc" },
      { nombre_normalizado: "hdl", valor: "50" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });

  test('debe calcular "HOMA-IR" cuando se proporcionan Glucosa e Insulina', () => {
    const resultadosOriginales = [
      { nombre_normalizado: "glucosa", valor: "90" },
      { nombre_normalizado: "insulina", valor: "10" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    const homa = resultadosCalculados.find(
      (r) => r.nombre_normalizado === "homa_ir"
    );

    expect(homa).toBeDefined();
    expect(homa.valor).toBeCloseTo(2.2222, 4);
  });

  test('debe calcular "EAG" cuando se proporciona Hemoglobina A1C', () => {
    const resultadosOriginales = [
      { nombre_normalizado: "hemoglobina a1c", valor: "5.4" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    const eag = resultadosCalculados.find(
      (r) => r.nombre_normalizado === "eag"
    );

    expect(eag).toBeDefined();
    expect(eag.valor).toBeCloseTo(108.28, 2);
  });

  test('debe calcular "tg_hdl_ratio" cuando se proporcionan Trigliceridos y HDL', () => {
    const resultadosOriginales = [
      { nombre_normalizado: "trigliceridos", valor: "100" },
      { nombre_normalizado: "hdl", valor: "50" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    const tgHdl = resultadosCalculados.find(
      (r) => r.nombre_normalizado === "tg_hdl_ratio"
    );

    expect(tgHdl).toBeDefined();
    expect(tgHdl.valor).toBe(2);
  });
});
