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
});
