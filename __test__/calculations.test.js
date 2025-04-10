const calculateAdditionalResults = require("../lib/calculations");

describe("calculateAdditionalResults", () => {
  test('debe calcular "Colesterol no HDL" correctamente cuando se proporcionan valores numéricos válidos para "Colesterol LDL" y "HDL"', () => {
    const resultadosOriginales = [
      { nombre: "Colesterol LDL", valor: "130" },
      { nombre: "HDL", valor: "50" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);

    expect(resultadosCalculados).toEqual([
      {
        nombre: "Colesterol no HDL",
        codigo_loic: "98040-7",
        valor: 80,
        unidad: "mg/dL",
        nombre_normalizado: "colesterol no hdl",
      },
    ]);
  });

  test("debe devolver un array vacío si falta el resultado de 'Colesterol LDL'", () => {
    const resultadosOriginales = [{ nombre: "HDL", valor: "50" }];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });

  test("debe devolver un array vacío si falta el resultado de 'HDL'", () => {
    const resultadosOriginales = [{ nombre: "Colesterol LDL", valor: "130" }];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });

  test("no debe calcular si los valores no son números válidos", () => {
    const resultadosOriginales = [
      { nombre: "Colesterol LDL", valor: "abc" },
      { nombre: "HDL", valor: "50" },
    ];

    const resultadosCalculados =
      calculateAdditionalResults(resultadosOriginales);
    expect(resultadosCalculados).toEqual([]);
  });
});
