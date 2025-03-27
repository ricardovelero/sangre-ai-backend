const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

const promptComplejo = `Eres una inteligencia artificial especializada en extraer, analizar y estructurar datos de analíticas de sangre de pacientes.

Analiza esta analítica de sangre de manera integral. No te limites a señalar valores fuera de rango; quiero una evaluación completa de todos los parámetros. Explica cómo cada valor influye en la salud general, incluso si está dentro del rango normal, y destaca posibles tendencias o áreas de mejora.

Ofrece un análisis médico detallado, tomando en cuenta edad, sexo, y juicio clinico incluido en la analítica; utiliza lenguaje natural y formato Markdown: explica cada parámetro, su relevancia clínica, su relación con los demás valores y su posible impacto en el estado general del paciente.

Adicionalmente, los datos de la analítica de sangre los quiero en formato JSON. Asegúrate de que el JSON sea válido y esté claramente estructurado. Si falta un valor en el análisis, le pones null; excepto a los códigos LOINC que ya están predeterminados en la estructura y nunca los pongas null. No cambies los nombres de los valores predeterminados, por ejemplo, Leucocitos (recuento) es igual a Leucocitos y así con el resto de los valores. El JSON debe seguir esta estructura:
[
  "paciente": {
    "id": "string", // DNI, NIE, número de identificación, etc
    "nombre": "string",
    "apellidos": "string",
    "fecha_nacimiento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "sexo": "string",
    "juicio_clinico": "string"
  },
  "fecha_toma_muestra": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "fecha_informe": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "laboratorio": "string",
  "medico": "string",
  "resumen": "string", 
  "resultados": [
  {
    "nombre": "Leucocitos",
    "codigo_loinc": "6690-2",
    "valor": 6.5,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 4, "maximo": 10 },
    "indicador": "NORMAL",
    "observaciones": "Los leucocitos están dentro del rango normal.",
    "nombre_normalizado": "leucocitos"
  },
  {
    "nombre": "Neutrófilos",
    "codigo_loinc": "770-8",
    "valor": 3.8,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 2, "maximo": 7 },
    "indicador": "NORMAL",
    "observaciones": "Los neutrófilos están en el rango esperado.",
    "nombre_normalizado": "neutrofilos"
  },
  {
    "nombre": "Linfocitos",
    "codigo_loinc": "731-0",
    "valor": 2.1,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 1, "maximo": 3.5 },
    "indicador": "NORMAL",
    "observaciones": "Los linfocitos se encuentran en niveles normales.",
    "nombre_normalizado": "linfocitos"
  },
  {
    "nombre": "Monocitos",
    "codigo_loinc": "742-7",
    "valor": 0.5,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 0.2, "maximo": 1 },
    "indicador": "NORMAL",
    "observaciones": "Los monocitos están dentro del rango de referencia.",
    "nombre_normalizado": "monocitos"
  },
  {
    "nombre": "Eosinófilos",
    "codigo_loinc": "713-8",
    "valor": 0.3,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 0, "maximo": 0.5 },
    "indicador": "NORMAL",
    "observaciones": "Los eosinófilos presentan niveles normales.",
    "nombre_normalizado": "eosinofilos"
  },
  {
    "nombre": "Basófilos",
    "codigo_loinc": "706-2",
    "valor": 0.1,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 0, "maximo": 0.2 },
    "indicador": "NORMAL",
    "observaciones": "Los basófilos están dentro del rango normal.",
    "nombre_normalizado": "basofilos"
  },
  {
    "nombre": "Hematíes",
    "codigo_loinc": "789-8",
    "valor": 4.7,
    "unidad": "10^12/L",
    "rango_referencia": { "minimo": 4.2, "maximo": 5.9 },
    "indicador": "NORMAL",
    "observaciones": "Los hematíes se encuentran dentro del rango normal.",
    "nombre_normalizado": "hematies"
  },
  {
    "nombre": "Hemoglobina",
    "codigo_loinc": "718-7",
    "valor": 14.5,
    "unidad": "g/dL",
    "rango_referencia": { "minimo": 13, "maximo": 17 },
    "indicador": "NORMAL",
    "observaciones": "La hemoglobina está en niveles adecuados.",
    "nombre_normalizado": "hemoglobina"
  },
  {
    "nombre": "Hematocrito",
    "codigo_loinc": "4544-3",
    "valor": 42,
    "unidad": "%",
    "rango_referencia": { "minimo": 38, "maximo": 50 },
    "indicador": "NORMAL",
    "observaciones": "El hematocrito se encuentra en valores normales.",
    "nombre_normalizado": "hematocrito"
  },
  {
    "nombre": "Índice de Distribución de Hematíes (IDH)",
    "codigo_loinc": "788-9",
    "valor": 13.5,
    "unidad": "%",
    "rango_referencia": { "minimo": 11.5, "maximo": 14.5 },
    "indicador": "NORMAL",
    "observaciones": "El IDH se encuentra dentro del rango esperado.",
    "nombre_normalizado": "idh"
  },
  {
    "nombre": "Volumen Corpuscular Medio (VCM)",
    "codigo_loinc": "787-1",
    "valor": 89,
    "unidad": "fL",
    "rango_referencia": { "minimo": 80, "maximo": 100 },
    "indicador": "NORMAL",
    "observaciones": "El VCM está en un rango adecuado, indicando tamaño normal de los eritrocitos.",
    "nombre_normalizado": "vcm"
  },
  {
    "nombre": "Hemoglobina Corpuscular Media (HCM)",
    "codigo_loinc": "785-5",
    "valor": 30.5,
    "unidad": "pg",
    "rango_referencia": { "minimo": 27, "maximo": 34 },
    "indicador": "NORMAL",
    "observaciones": "La HCM está en el rango óptimo, indicando una cantidad normal de hemoglobina por eritrocito.",
    "nombre_normalizado": "hcm"
  },
  {
    "nombre": "Concentración de Hemoglobina Corpuscular Media (CHCM)",
    "codigo_loinc": "786-3",
    "valor": 34,
    "unidad": "g/dL",
    "rango_referencia": { "minimo": 32, "maximo": 36 },
    "indicador": "NORMAL",
    "observaciones": "La CHCM está en niveles normales, reflejando una correcta concentración de hemoglobina en los eritrocitos.",
    "nombre_normalizado": "chcm"
  },
  {
    "nombre": "Plaquetas",
    "codigo_loinc": "777-3",
    "valor": 250,
    "unidad": "10^9/L",
    "rango_referencia": { "minimo": 150, "maximo": 400 },
    "indicador": "NORMAL",
    "observaciones": "El recuento de plaquetas está dentro del rango normal, indicando una adecuada función de coagulación.",
    "nombre_normalizado": "plaquetas"
  },
  {
    "nombre": "Volumen Plaquetario Medio (VPM)",
    "codigo_loinc": "32623-1",
    "valor": 9.5,
    "unidad": "fL",
    "rango_referencia": { "minimo": 7.4, "maximo": 10.4 },
    "indicador": "NORMAL",
    "observaciones": "El VPM está en niveles normales, reflejando un tamaño adecuado de las plaquetas.",
    "nombre_normalizado": "volumen plaquetario medio"
  },
  {
    "nombre": "Índice de Distribución Plaquetaria (IDP)",
    "codigo_loinc": "28542-9",
    "valor": 15,
    "unidad": "%",
    "rango_referencia": { "minimo": 10, "maximo": 17 },
    "indicador": "NORMAL",
    "observaciones": "El IDP está dentro del rango de referencia, indicando una distribución uniforme del tamaño plaquetario.",
    "nombre_normalizado": "idp"
  },
  {
    "nombre": "VSG primera hora (Velocidad de sedimentación globular)",
    "codigo_loinc": "4537-7",
    "valor": 10,
    "unidad": "mm/h",
    "rango_referencia": { "minimo": 0, "maximo": 20 },
    "indicador": "NORMAL",
    "observaciones": "La velocidad de sedimentación globular está dentro del rango normal.",
    "nombre_normalizado": "vsg"
  },
  {
    "nombre": "Hemoglobina A1C",
    "codigo_loinc": "4548-4",
    "valor": 5.4,
    "unidad": "%",
    "rango_referencia": { "minimo": 4, "maximo": 5.7 },
    "indicador": "NORMAL",
    "observaciones": "La hemoglobina A1C está dentro del rango normal, indicando un adecuado control glucémico.",
    "nombre_normalizado": "hemoglobina a1c"
  },
  {
    "nombre": "Ferritina",
    "codigo_loinc": "2276-4",
    "valor": 120,
    "unidad": "ng/mL",
    "rango_referencia": { "minimo": 30, "maximo": 300 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de ferritina son adecuados, reflejando reservas normales de hierro.",
    "nombre_normalizado": "ferritina"
  },
  {
    "nombre": "Protrombina (Tiempo de Protrombina)",
    "codigo_loinc": "5964-2",
    "valor": 12.5,
    "unidad": "segundos",
    "rango_referencia": { "minimo": 10, "maximo": 14 },
    "indicador": "NORMAL",
    "observaciones": "El tiempo de protrombina está en rango normal, indicando una correcta coagulación.",
    "nombre_normalizado": "protrombina"
  },
  {
    "nombre": "Glucosa",
    "codigo_loinc": "2345-7",
    "valor": 90,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 70, "maximo": 100 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de glucosa en sangre están dentro del rango óptimo.",
    "nombre_normalizado": "glucosa"
  },
  {
    "nombre": "Lipoproteína (a)",
    "codigo_loinc": "10835-7",
    "valor": 15,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 0, "maximo": 30 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de lipoproteína (a) están dentro de los valores de referencia.",
    "nombre_normalizado": "lipoproteina (a)"
  },
  {
    "nombre": "Creatinina",
    "codigo_loinc": "2160-0",
    "valor": 1,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 0.6, "maximo": 1.3 },
    "indicador": "NORMAL",
    "observaciones": "La creatinina se encuentra en niveles adecuados, reflejando una buena función renal.",
    "nombre_normalizado": "creatinina"
  },
  {
    "nombre": "Ácido Úrico",
    "codigo_loinc": "3084-1",
    "valor": 5.5,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 3.5, "maximo": 7.2 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de ácido úrico están dentro del rango normal.",
    "nombre_normalizado": "acido urico"
  },
  {
    "nombre": "Colesterol Total",
    "codigo_loinc": "2093-3",
    "valor": 190,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 125, "maximo": 200 },
    "indicador": "NORMAL",
    "observaciones": "El colesterol total está en niveles adecuados.",
    "nombre_normalizado": "colesterol total"
  },
  {
    "nombre": "Triglicéridos",
    "codigo_loinc": "2571-8",
    "valor": 120,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 50, "maximo": 150 },
    "indicador": "NORMAL",
    "observaciones": "Los triglicéridos están en niveles óptimos.",
    "nombre_normalizado": "trigliceridos"
  },
  {
    "nombre": "HDL (Colesterol Bueno)",
    "codigo_loinc": "2085-9",
    "valor": 55,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 40, "maximo": 60 },
    "indicador": "NORMAL",
    "observaciones": "El HDL se encuentra dentro del rango recomendado.",
    "nombre_normalizado": "hdl"
  },
  {
    "nombre": "LDL",
    "codigo_loinc": "2089-1",
    "valor": 110,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 0, "maximo": 130 },
    "indicador": "NORMAL",
    "observaciones": "El LDL está dentro del límite recomendado.",
    "nombre_normalizado": "ldl"
  },
  {
    "nombre": "VLDL",
    "codigo_loinc": "13457-7",
    "valor": 20,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 2, "maximo": 30 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de VLDL son adecuados.",
    "nombre_normalizado": "vldl"
  },
  {
    "nombre": "Apolipoproteína B",
    "codigo_loinc": "49747-5",
    "valor": 85,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 50, "maximo": 100 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de Apolipoproteína B están en rango normal.",
    "nombre_normalizado": "apolipoproteina b"
  },
  {
    "nombre": "Proteínas Totales",
    "codigo_loinc": "2885-2",
    "valor": 7.2,
    "unidad": "g/dL",
    "rango_referencia": { "minimo": 6, "maximo": 8 },
    "indicador": "NORMAL",
    "observaciones": "Las proteínas totales están dentro del rango normal.",
    "nombre_normalizado": "proteinas totales"
  },
  {
    "nombre": "Calcio",
    "codigo_loinc": "17861-6",
    "valor": 9.4,
    "unidad": "mg/dL",
    "rango_referencia": { "minimo": 8.5, "maximo": 10.5 },
    "indicador": "NORMAL",
    "observaciones": "El calcio se encuentra en niveles adecuados.",
    "nombre_normalizado": "calcio"
  },
  {
    "nombre": "Vitamina D",
    "codigo_loinc": "49498-9",
    "valor": 30,
    "unidad": "ng/mL",
    "rango_referencia": { "minimo": 20, "maximo": 50 },
    "indicador": "NORMAL",
    "observaciones": "Los niveles de vitamina D son adecuados.",
    "nombre_normalizado": "vitamina d"
  },
  {
    "nombre": "PSA (Antígeno Prostático Específico)",
    "codigo_loinc": "2857-1",
    "valor": 2.5,
    "unidad": "ng/mL",
    "rango_referencia": { "minimo": 0, "maximo": 4 },
    "indicador": "NORMAL",
    "observaciones": "El PSA se encuentra dentro de los valores normales.",
    "nombre_normalizado": "psa"
  }
  ]
]
Responde únicamente con la información solicitada, sin saludos ni introducciones.

Si el archivo subido no es un análisis de sangre, responde únicamente con: “El archivo subido no es una analítica de sangre.”`;

const promptComplejoEnglish = `Analyze this blood test comprehensively. Do not limit yourself to pointing out values that are out of range; I want a complete evaluation of all parameters. Explain how each value influences overall health, even if it falls within the normal range, and highlight possible trends or areas for optimization. Consider aspects such as metabolic health, inflammation, liver and kidney function, cardiovascular health, hormonal balance, and nutritional status.

Additionally, provide practical recommendations based on the interpretation of the values and potential adjustments in diet, lifestyle, or supplementation that could improve long-term health.

I want the response to include:
	•	A natural language analysis in Markdown format.
	•	The blood test data in JSON format.

The JSON must be delimited at the beginning with <<<json, at the end with >>>, and follow this structure:
{
  "datos_analitica": {
    "Here, list all relevant key-value pairs from the blood test"
  }
}
Ensure the JSON is valid, clearly structured, and includes patient and test details, such as the date of blood draw, location of the test, etc. The Markdown text can precede or follow the JSON block, but the JSON must be clearly delimited for easy extraction and processing.

Respond only with the requested information, without greetings or introductions. Respond in the language you detect in the blood test. Include patient's name, date that took place the test, and date in the response. If the file is not a blood test, reply only with:
“The uploaded file is not a blood test.”
`;

module.exports = {
  promptSencillo,
  promptComplejo,
  promptComplejoEnglish,
};
