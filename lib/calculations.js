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

  // Calcular "Colesterol no HDL"
  const ldlObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "ldl"
  );
  const hdlObj = resultadosOriginales.find(
    (r) => r.nombre_normalizado === "hdl"
  );

  if (ldlObj && hdlObj) {
    const ldlValue = parseFloat(ldlObj.valor);
    const hdlValue = parseFloat(hdlObj.valor);
    if (!isNaN(ldlValue) && !isNaN(hdlValue)) {
      additionalResults.push({
        nombre: "Colesterol no HDL",
        codigo_loic: "98040-7",
        valor: ldlValue - hdlValue,
        unidad: "mg/dL",
        nombre_normalizado: "colesterol no hdl",
      });
    }
  }

  // Aquí puedes incluir otros cálculos, por ejemplo:
  // const otroCalc = ...
  // additionalResults.push({ nombre: "Otro Cálculo", valor: otroCalc, ... });

  return additionalResults;
}

module.exports = calculateAdditionalResults;
