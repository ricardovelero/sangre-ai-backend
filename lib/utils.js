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
    .replace(/.*\blipoproteina \(a\)\b.*?/g, "lipo (a)")
    .replace(/.*\bapolipoproteina b\b.*?/g, "apo b")
    .replace(/\s*\(.*?\)/g, "");
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

module.exports = {
  normalizeString,
  normalizeStringAndFixSomeNames,
  toTitleCase,
};
