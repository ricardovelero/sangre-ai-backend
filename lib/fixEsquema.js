const { normalizeStringAndFixSomeNames } = require("./utils");

const esquema = [
  {
    nombre: "Leucocitos",
    codigo_loinc: "6690-2",
    valor: 6.5,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 4.0,
      maximo: 10.0,
    },
    indicador: "NORMAL",
    observaciones: "Los leucocitos están dentro del rango normal.",
  },
  {
    nombre: "Neutrófilos",
    codigo_loinc: "770-8",
    valor: 3.8,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 2.0,
      maximo: 7.0,
    },
    indicador: "NORMAL",
    observaciones: "Los neutrófilos están en el rango esperado.",
  },
  {
    nombre: "Linfocitos",
    codigo_loinc: "731-0",
    valor: 2.1,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 1.0,
      maximo: 3.5,
    },
    indicador: "NORMAL",
    observaciones: "Los linfocitos se encuentran en niveles normales.",
  },
  {
    nombre: "Monocitos",
    codigo_loinc: "742-7",
    valor: 0.5,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 0.2,
      maximo: 1.0,
    },
    indicador: "NORMAL",
    observaciones: "Los monocitos están dentro del rango de referencia.",
  },
  {
    nombre: "Eosinófilos",
    codigo_loinc: "713-8",
    valor: 0.3,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 0.0,
      maximo: 0.5,
    },
    indicador: "NORMAL",
    observaciones: "Los eosinófilos presentan niveles normales.",
  },
  {
    nombre: "Basófilos",
    codigo_loinc: "706-2",
    valor: 0.1,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 0.0,
      maximo: 0.2,
    },
    indicador: "NORMAL",
    observaciones: "Los basófilos están dentro del rango normal.",
  },
  {
    nombre: "Hematíes",
    codigo_loinc: "789-8",
    valor: 4.7,
    unidad: "10^12/L",
    rango_referencia: {
      minimo: 4.2,
      maximo: 5.9,
    },
    indicador: "NORMAL",
    observaciones: "Los hematíes se encuentran dentro del rango normal.",
  },
  {
    nombre: "Hemoglobina",
    codigo_loinc: "718-7",
    valor: 14.5,
    unidad: "g/dL",
    rango_referencia: {
      minimo: 13.0,
      maximo: 17.0,
    },
    indicador: "NORMAL",
    observaciones: "La hemoglobina está en niveles adecuados.",
  },
  {
    nombre: "Hematocrito",
    codigo_loinc: "4544-3",
    valor: 42,
    unidad: "%",
    rango_referencia: {
      minimo: 38.0,
      maximo: 50.0,
    },
    indicador: "NORMAL",
    observaciones: "El hematocrito se encuentra en valores normales.",
  },
  {
    nombre: "Índice de Distribución de Hematíes (IDH)",
    codigo_loinc: "788-9",
    valor: 13.5,
    unidad: "%",
    rango_referencia: {
      minimo: 11.5,
      maximo: 14.5,
    },
    indicador: "NORMAL",
    observaciones: "El IDH se encuentra dentro del rango esperado.",
  },
  {
    nombre: "Volumen Corpuscular Medio (VCM)",
    codigo_loinc: "787-1",
    valor: 89,
    unidad: "fL",
    rango_referencia: {
      minimo: 80,
      maximo: 100,
    },
    indicador: "NORMAL",
    observaciones:
      "El VCM está en un rango adecuado, indicando tamaño normal de los eritrocitos.",
  },
  {
    nombre: "Hemoglobina Corpuscular Media (HCM)",
    codigo_loinc: "785-5",
    valor: 30.5,
    unidad: "pg",
    rango_referencia: {
      minimo: 27,
      maximo: 34,
    },
    indicador: "NORMAL",
    observaciones:
      "La HCM está en el rango óptimo, indicando una cantidad normal de hemoglobina por eritrocito.",
  },
  {
    nombre: "Concentración de Hemoglobina Corpuscular Media (CHCM)",
    codigo_loinc: "786-3",
    valor: 34.0,
    unidad: "g/dL",
    rango_referencia: {
      minimo: 32,
      maximo: 36,
    },
    indicador: "NORMAL",
    observaciones:
      "La CHCM está en niveles normales, reflejando una correcta concentración de hemoglobina en los eritrocitos.",
  },
  {
    nombre: "Plaquetas",
    codigo_loinc: "777-3",
    valor: 250,
    unidad: "10^9/L",
    rango_referencia: {
      minimo: 150,
      maximo: 400,
    },
    indicador: "NORMAL",
    observaciones:
      "El recuento de plaquetas está dentro del rango normal, indicando una adecuada función de coagulación.",
  },
  {
    nombre: "Volumen Plaquetario Medio (VPM)",
    codigo_loinc: "32623-1",
    valor: 9.5,
    unidad: "fL",
    rango_referencia: {
      minimo: 7.4,
      maximo: 10.4,
    },
    indicador: "NORMAL",
    observaciones:
      "El VPM está en niveles normales, reflejando un tamaño adecuado de las plaquetas.",
  },
  {
    nombre: "Índice de Distribución Plaquetaria (IDP)",
    codigo_loinc: "28542-9",
    valor: 15.0,
    unidad: "%",
    rango_referencia: {
      minimo: 10.0,
      maximo: 17.0,
    },
    indicador: "NORMAL",
    observaciones:
      "El IDP está dentro del rango de referencia, indicando una distribución uniforme del tamaño plaquetario.",
  },
  {
    nombre: "VSG primera hora (Velocidad de sedimentación globular)",
    codigo_loinc: "4537-7",
    valor: 10,
    unidad: "mm/h",
    rango_referencia: {
      minimo: 0,
      maximo: 20,
    },
    indicador: "NORMAL",
    observaciones:
      "La velocidad de sedimentación globular está dentro del rango normal.",
  },
  {
    nombre: "Hemoglobina A1C",
    codigo_loinc: "4548-4",
    valor: 5.4,
    unidad: "%",
    rango_referencia: {
      minimo: 4.0,
      maximo: 5.7,
    },
    indicador: "NORMAL",
    observaciones:
      "La hemoglobina A1C está dentro del rango normal, indicando un adecuado control glucémico.",
  },
  {
    nombre: "Ferritina",
    codigo_loinc: "2276-4",
    valor: 120,
    unidad: "ng/mL",
    rango_referencia: {
      minimo: 30,
      maximo: 300,
    },
    indicador: "NORMAL",
    observaciones:
      "Los niveles de ferritina son adecuados, reflejando reservas normales de hierro.",
  },
  {
    nombre: "Protrombina (Tiempo de Protrombina)",
    codigo_loinc: "5964-2",
    valor: 12.5,
    unidad: "segundos",
    rango_referencia: {
      minimo: 10.0,
      maximo: 14.0,
    },
    indicador: "NORMAL",
    observaciones:
      "El tiempo de protrombina está en rango normal, indicando una correcta coagulación.",
  },
  {
    nombre: "Glucosa",
    codigo_loinc: "2345-7",
    valor: 90,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 70,
      maximo: 100,
    },
    indicador: "NORMAL",
    observaciones:
      "Los niveles de glucosa en sangre están dentro del rango óptimo.",
  },
  {
    nombre: "Lipoproteína (a)",
    codigo_loinc: "10835-7",
    valor: 15,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 0,
      maximo: 30,
    },
    indicador: "NORMAL",
    observaciones:
      "Los niveles de lipoproteína (a) están dentro de los valores de referencia.",
  },
  {
    nombre: "Creatinina",
    codigo_loinc: "2160-0",
    valor: 1.0,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 0.6,
      maximo: 1.3,
    },
    indicador: "NORMAL",
    observaciones:
      "La creatinina se encuentra en niveles adecuados, reflejando una buena función renal.",
  },
  {
    nombre: "Ácido Úrico",
    codigo_loinc: "3084-1",
    valor: 5.5,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 3.5,
      maximo: 7.2,
    },
    indicador: "NORMAL",
    observaciones: "Los niveles de ácido úrico están dentro del rango normal.",
  },
  {
    nombre: "Colesterol Total",
    codigo_loinc: "2093-3",
    valor: 190,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 125,
      maximo: 200,
    },
    indicador: "NORMAL",
    observaciones: "El colesterol total está en niveles adecuados.",
  },
  {
    nombre: "Triglicéridos",
    codigo_loinc: "2571-8",
    valor: 120,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 50,
      maximo: 150,
    },
    indicador: "NORMAL",
    observaciones: "Los triglicéridos están en niveles óptimos.",
  },
  {
    nombre: "HDL (Colesterol Bueno)",
    codigo_loinc: "2085-9",
    valor: 55,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 40,
      maximo: 60,
    },
    indicador: "NORMAL",
    observaciones: "El HDL se encuentra dentro del rango recomendado.",
  },
  {
    nombre: "LDL",
    codigo_loinc: "2089-1",
    valor: 110,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 0,
      maximo: 130,
    },
    indicador: "NORMAL",
    observaciones: "El LDL está dentro del límite recomendado.",
  },
  {
    nombre: "VLDL",
    codigo_loinc: "13457-7",
    valor: 20,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 2,
      maximo: 30,
    },
    indicador: "NORMAL",
    observaciones: "Los niveles de VLDL son adecuados.",
  },
  {
    nombre: "Apolipoproteína B",
    codigo_loinc: "49747-5",
    valor: 85,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 50,
      maximo: 100,
    },
    indicador: "NORMAL",
    observaciones: "Los niveles de Apolipoproteína B están en rango normal.",
  },
  {
    nombre: "Proteínas Totales",
    codigo_loinc: "2885-2",
    valor: 7.2,
    unidad: "g/dL",
    rango_referencia: {
      minimo: 6.0,
      maximo: 8.0,
    },
    indicador: "NORMAL",
    observaciones: "Las proteínas totales están dentro del rango normal.",
  },
  {
    nombre: "Calcio",
    codigo_loinc: "17861-6",
    valor: 9.4,
    unidad: "mg/dL",
    rango_referencia: {
      minimo: 8.5,
      maximo: 10.5,
    },
    indicador: "NORMAL",
    observaciones: "El calcio se encuentra en niveles adecuados.",
  },
  {
    nombre: "Vitamina D",
    codigo_loinc: "49498-9",
    valor: 30,
    unidad: "ng/mL",
    rango_referencia: {
      minimo: 20,
      maximo: 50,
    },
    indicador: "NORMAL",
    observaciones: "Los niveles de vitamina D son adecuados.",
  },
  {
    nombre: "PSA (Antígeno Prostático Específico)",
    codigo_loinc: "2857-1",
    valor: 2.5,
    unidad: "ng/mL",
    rango_referencia: {
      minimo: 0.0,
      maximo: 4.0,
    },
    indicador: "NORMAL",
    observaciones: "El PSA se encuentra dentro de los valores normales.",
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
