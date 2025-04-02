function normalizeString(str) {
  return str
    .normalize("NFD") // Decompose accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase(); // Convert to lowercase
}

function normalizeStringAndFixSomeNames(str) {
  return normalizeString(str)
    .replace(/hdl(\s*\(.*?\))?/g, "hdl")
    .replace(/ldl(\s*\(.*?\))?/g, "ldl")
    .replace(/vldl(\s*\(.*?\))?/g, "vldl")
    .replace(/volumen corpuscular medio \(vcm\)/g, "vcm")
    .replace(/volumen corpuscular medio/g, "vcm")
    .replace(/hemoglobina corpuscular media \(hcm\)/g, "hcm")
    .replace(/hemoglobina corpuscular media/g, "hcm")
    .replace(/concentracion de hemoglobina corpuscular media \(chcm\)/g, "chcm")
    .replace(/concentracion de hemoglobina corpuscular media/g, "chcm")
    .replace(/indice de distribucion de hematies \(idh\)/g, "idh")
    .replace(/indice de distribucion plaquetaria/g, "idp")
    .replace(/vsg primera hora \(velocidad de sedimentacion globular\)/g, "vsg")
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
