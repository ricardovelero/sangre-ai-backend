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

  const parseValue = (value) => {
    if (value === null || value === undefined) {
      return NaN;
    }
    if (typeof value === "number") {
      return value;
    }
    return parseFloat(String(value).replace(",", "."));
  };

  const findByName = (name) =>
    resultadosOriginales.find((r) => r.nombre_normalizado === name);
  const findByNames = (names) =>
    resultadosOriginales.find((r) => names.includes(r.nombre_normalizado));

  const colesterolTotalObj = findByName("colesterol total");
  const hdlObj = findByName("hdl");
  const ldlObj = findByName("ldl");
  const trigObj = findByName("trigliceridos");
  const glucosaObj = findByName("glucosa");
  const insulinaObj = findByName("insulina");
  const hemoglobinaA1cObj = findByNames([
    "hemoglobina a1c",
    "hemoglobina glicosilada a1c",
    "hemoglobina_glicosilada_a1c",
    "hba1c",
    "hb a1c",
  ]);

  if (hdlObj && ldlObj) {
    const hdlValue = parseValue(hdlObj.valor);
    const ldlValue = parseValue(ldlObj.valor);
    if (!isNaN(ldlValue) && !isNaN(hdlValue) && hdlValue !== 0) {
      // Relación LDL/HDL
      additionalResults.push({
        nombre: "LDL/HDL",
        codigo_loic: "9832-7",
        valor: ldlValue / hdlValue,
        unidad: null,
        nombre_normalizado: "ldl/hdl",
      });
    }
  }

  if (trigObj && hdlObj) {
    const trigValue = parseValue(trigObj.valor);
    const hdlValue = parseValue(hdlObj.valor);
    if (!isNaN(trigValue) && !isNaN(hdlValue) && hdlValue !== 0) {
      // Relación Triglicéridos/HDL
      additionalResults.push({
        nombre: "Trigliceridos/HDL",
        codigo_loic: "9830-1",
        valor: trigValue / hdlValue,
        unidad: null,
        nombre_normalizado: "trigliceridos/hdl",
      });
      additionalResults.push({
        nombre: "TG/HDL Ratio",
        codigo_loic: null,
        valor: trigValue / hdlValue,
        unidad: null,
        nombre_normalizado: "tg_hdl_ratio",
      });
    }
  }

  if (colesterolTotalObj && hdlObj) {
    const colesterolTotalValue = parseValue(colesterolTotalObj.valor);
    const hdlValue = parseValue(hdlObj.valor);
    if (
      !isNaN(colesterolTotalValue) &&
      !isNaN(hdlValue) &&
      hdlValue !== 0
    ) {
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
    }
  }

  if (glucosaObj && insulinaObj) {
    const glucosaValue = parseValue(glucosaObj.valor);
    const insulinaValue = parseValue(insulinaObj.valor);
    if (!isNaN(glucosaValue) && !isNaN(insulinaValue)) {
      // Índice HOMA-IR (mg/dL * uU/mL / 405)
      additionalResults.push({
        nombre: "HOMA-IR",
        codigo_loic: null,
        valor: (glucosaValue * insulinaValue) / 405,
        unidad: null,
        nombre_normalizado: "homa_ir",
      });
    }
  }

  if (hemoglobinaA1cObj) {
    const a1cValue = parseValue(hemoglobinaA1cObj.valor);
    if (!isNaN(a1cValue)) {
      // EAG (estimated average glucose)
      additionalResults.push({
        nombre: "EAG",
        codigo_loic: null,
        valor: 28.7 * a1cValue - 46.7,
        unidad: "mg/dL",
        nombre_normalizado: "eag",
      });
    }
  }

  return additionalResults;
}

module.exports = calculateAdditionalResults;
