/**
 * Calcula resultados adicionales a partir del array de resultados originales.
 * Actualmente calcula "Colesterol no HDL" (LDL - HDL).
 * Puedes agregar más cálculos en el futuro.
 *
 * @param {Array} resultadosOriginales - Array de objetos de resultados
 * @returns {Array} Array con los resultados calculados
 */
function calculateAdditionalResults(resultadosOriginales) {
  const additionalResults = [];

  const colesterolTotalObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "colesterol total"
  );
  const hdlObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "hdl"
  );
  const ldlObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "ldl"
  );
  const trigObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "trigliceridos"
  );

  if (colesterolTotalObj && hdlObj) {
    const colesterolTotalValue = parseFloat(colesterolTotalObj.valor);
    const hdlValue = parseFloat(hdlObj.valor);
    const ldlValue = parseFloat(ldlObj.valor);
    const trigValue = parseFloat(trigObj.valor);
    if (!isNaN(colesterolTotalValue) && !isNaN(hdlValue)) {
      // Colesterol no HDL
      additionalResults.push({
        nombre: "Colesterol no HDL",
        codigo_loic: "9840-7",
        valor: colesterolTotalValue - hdlValue,
        unidad: "mg/dL",
        nombre_normalizado: "colesterol no hdl",
      });
      // Relación colesterol total / HDL
      additionalResults.push({
        nombre: "Colesterol Total / HDL",
        codigo_loic: "9833-5",
        valor: colesterolTotalValue / hdlValue,
        unidad: null,
        nombre_normalizado: "total/hdl",
      });
      // Relación LDL/HDL
      additionalResults.push({
        nombre: "LDL/HDL",
        codigo_loic: "9832-7",
        valor: ldlValue / hdlValue,
        unidad: null,
        nombre_normalizado: "ldl/hdl",
      });
      // Relación Triglicéridos/HDL
      additionalResults.push({
        nombre: "Trigliceridos/HDL",
        codigo_loic: "9830-1",
        valor: trigValue / hdlValue,
        unidad: null,
        nombre_normalizado: "trigliceridos/hdl",
      });
    }
  }

  return additionalResults;
}

module.exports = calculateAdditionalResults;
