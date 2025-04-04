function normalizeString(str) {
  return str
    .normalize("NFD") // Decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase(); // Convert to lowercase
}

function normalizeStringAndFixSomeNames(str) {
  return normalizeString(str)
    .replace(/.*\bldl\b.*/g, "ldl")
    .replace(/.*\bhdl\b.*?/g, "hdl")
    .replace(/.*\bvldl\b.*?/g, "vldl")
    .replace(/.*\bvolumen plaquetario medio\b.*?/g, "vpm")
    .replace(/.*\bvpm\b.*?/g, "vpm")
    .replace(/.*\bvolumen corpuscular medio\b.*?/g, "vcm")
    .replace(/.*\bvcm\b.*?/g, "vcm")
    .replace(/.*\bhemoglobina corpuscular media\b.*?/g, "hcm")
    .replace(/.*\bhcm\b.*?/g, "hcm")
    .replace(/.*\bconcentracion de hemoglobina corpuscular media\b.*?/g, "chcm")
    .replace(/.*\bchcm\b.*?/g, "chcm")
    .replace(/.*\bindice de distribucion de hematies\b.*?/g, "idh")
    .replace(/.*\bidp\b.*?/g, "idp")
    .replace(/.*\bindice de distribucion plaquetaria\b.*?/g, "idp")
    .replace(/.*\bvsg primera hora\b.*?/g, "vsg")
    .replace(/.*\bapolipoproteina b\b.*?/g, "apo b")
    .replace(/\s*\(.*?\)\s*/g, "")
    .replace(/[()]/g, "")
    .replace(/.*\blipoproteina\b.*?/g, "lipo (a)");
}

function toTitleCase(str) {
  if (str && str !== "N/A" && typeof str === "string") {
    return str
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(
        /(^|\s)([a-záéíóúüñ])/g,
        (_, boundary, char) => boundary + char.toUpperCase()
      );
  }
}

// Solo si estás ejecutando este archivo directamente, corre los tests de ejemplo
if (require.main === module) {
  const assert = require("assert");

  const cases = [
    { input: "volumen corpuscular Medio (VCM)", expected: "vcm" },
    { input: "VCM", expected: "vcm" },
    { input: "volumen corpuscular medio", expected: "vcm" },
    { input: "HCM (hemoglobina corpuscular media)", expected: "hcm" },
    { input: "Colesterol LDL (el malo)", expected: "ldl" },
    { input: "Lipoproteina (a)", expected: "lipo (a)" },
    { input: "apolipoproteina b", expected: "apo b" },
  ];

  for (const { input, expected } of cases) {
    const result = normalizeStringAndFixSomeNames(input);
    assert.strictEqual(
      result,
      expected,
      `❌ "${input}" → "${result}", se esperaba "${expected}"`
    );
  }

  console.log("✅ Todos los tests de normalizeStringAndFixSomeNames pasaron.");
}

module.exports = {
  normalizeString,
  normalizeStringAndFixSomeNames,
  toTitleCase,
};
