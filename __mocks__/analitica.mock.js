function getMockAnalitica(overrides = {}) {
  return {
    paciente: { nombre: "Test paciente" },
    fecha_toma_muestra: new Date(),
    fecha_informe: new Date(),
    laboratorio: "Test Lab",
    medico: "Dr. Test",
    markdown: "Test markdown",
    resumen: "Test resumen",
    resultados: [
      {
        nombre: "Colesterol Total",
        valor: "200",
        unidad: "mg/dL",
        nombre_normalizado: "colesterol total",
      },
      {
        nombre: "Triglicéridos",
        valor: "100",
        unidad: "mg/dL",
        nombre_normalizado: "trigliceridos",
      },
      {
        nombre: "HDL",
        valor: "50",
        unidad: "mg/dL",
        nombre_normalizado: "hdl",
      },
      {
        nombre: "Colesterol LDL",
        valor: "160",
        unidad: "mg/dL",
        nombre_normalizado: "ldl",
      },
    ],
    owner: "65f1e8afd91baac7eb38d5cc",
    ...overrides,
  };
}

module.exports = { getMockAnalitica };
