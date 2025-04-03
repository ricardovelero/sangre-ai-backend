const { normalizeStringAndFixSomeNames } = require("./utils");

const esquema = [
  {
    nombre: "Leucocitos",
    codigo_loinc: "6690-2",
    valor: 6.5,
    unidad: "10^9/L",
  },
  {
    nombre: "Neutrófilos",
    codigo_loinc: "770-8",
    valor: 3.8,
    unidad: "10^9/L",
  },
  {
    nombre: "Linfocitos",
    codigo_loinc: "731-0",
    valor: 2.1,
    unidad: "10^9/L",
  },
  {
    nombre: "Monocitos",
    codigo_loinc: "742-7",
    valor: 0.5,
    unidad: "10^9/L",
  },
  {
    nombre: "Eosinófilos",
    codigo_loinc: "713-8",
    valor: 0.3,
    unidad: "10^9/L",
  },
  {
    nombre: "Basófilos",
    codigo_loinc: "706-2",
    valor: 0.1,
    unidad: "10^9/L",
  },
  {
    nombre: "Hematíes",
    codigo_loinc: "789-8",
    valor: 4.7,
    unidad: "10^12/L",
  },
  {
    nombre: "Hemoglobina",
    codigo_loinc: "718-7",
    valor: 14.5,
    unidad: "g/dL",
  },
  {
    nombre: "Hematocrito",
    codigo_loinc: "4544-3",
    valor: 42,
    unidad: "%",
  },
  {
    nombre: "Índice de Distribución de Hematíes (IDH)",
    codigo_loinc: "788-9",
    valor: 13.5,
    unidad: "%",
  },
  {
    nombre: "Volumen Corpuscular Medio (VCM)",
    codigo_loinc: "787-1",
    valor: 89,
    unidad: "fL",
  },
  {
    nombre: "Hemoglobina Corpuscular Media (HCM)",
    codigo_loinc: "785-5",
    valor: 30.5,
    unidad: "pg",
  },
  {
    nombre: "Concentración de Hemoglobina Corpuscular Media (CHCM)",
    codigo_loinc: "786-3",
    valor: 34.0,
    unidad: "g/dL",
  },
  {
    nombre: "Plaquetas",
    codigo_loinc: "777-3",
    valor: 250,
    unidad: "10^9/L",
  },
  {
    nombre: "Volumen Plaquetario Medio (VPM)",
    codigo_loinc: "32623-1",
    valor: 9.5,
    unidad: "fL",
  },
  {
    nombre: "Índice de Distribución Plaquetaria (IDP)",
    codigo_loinc: "28542-9",
    valor: 15.0,
    unidad: "%",
  },
  {
    nombre: "VSG primera hora (Velocidad de sedimentación globular)",
    codigo_loinc: "4537-7",
    valor: 10,
    unidad: "mm/h",
  },
  {
    nombre: "Hemoglobina A1C",
    codigo_loinc: "4548-4",
    valor: 5.4,
    unidad: "%",
  },
  {
    nombre: "Ferritina",
    codigo_loinc: "2276-4",
    valor: 120,
    unidad: "ng/mL",
  },
  {
    nombre: "Protrombina (Tiempo de Protrombina)",
    codigo_loinc: "5964-2",
    valor: 12.5,
    unidad: "segundos",
  },
  {
    nombre: "Glucosa",
    codigo_loinc: "2345-7",
    valor: 90,
    unidad: "mg/dL",
  },
  {
    nombre: "Lipoproteína (a)",
    codigo_loinc: "10835-7",
    valor: 15,
    unidad: "mg/dL",
  },
  {
    nombre: "Creatinina",
    codigo_loinc: "2160-0",
    valor: 1.0,
    unidad: "mg/dL",
  },
  {
    nombre: "Ácido Úrico",
    codigo_loinc: "3084-1",
    valor: 5.5,
    unidad: "mg/dL",
  },
  {
    nombre: "Colesterol Total",
    codigo_loinc: "2093-3",
    valor: 190,
    unidad: "mg/dL",
  },
  {
    nombre: "Triglicéridos",
    codigo_loinc: "2571-8",
    valor: 120,
    unidad: "mg/dL",
  },
  {
    nombre: "HDL (Colesterol Bueno)",
    codigo_loinc: "2085-9",
    valor: 55,
    unidad: "mg/dL",
  },
  {
    nombre: "Colesterol (LDL)",
    codigo_loinc: "2089-1",
    valor: 110,
    unidad: "mg/dL",
  },
  {
    nombre: "VLDL",
    codigo_loinc: "13457-7",
    valor: 20,
    unidad: "mg/dL",
  },
  {
    nombre: "Apolipoproteína B",
    codigo_loinc: "49747-5",
    valor: 85,
    unidad: "mg/dL",
  },
  {
    nombre: "Proteínas Totales",
    codigo_loinc: "2885-2",
    valor: 7.2,
    unidad: "g/dL",
  },
  {
    nombre: "Calcio",
    codigo_loinc: "17861-6",
    valor: 9.4,
    unidad: "mg/dL",
  },
  {
    nombre: "Vitamina D",
    codigo_loinc: "49498-9",
    valor: 30,
    unidad: "ng/mL",
  },
  {
    nombre: "PSA (Antígeno Prostático Específico)",
    codigo_loinc: "2857-1",
    valor: 2.5,
    unidad: "ng/mL",
  },
];

function fixEsquema(esquema) {
  return esquema.map((resultado) => {
    return {
      ...resultado,
      nombre_normalizado: normalizeStringAndFixSomeNames(resultado.nombre),
    };
  });
}

console.log(fixEsquema(esquema));

fixEsquema(esquema);
