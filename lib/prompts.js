const systemInstruction = `Eres una IA especializada en extraer y estructurar datos de análisis de sangre de pacientes. Analiza este análisis de sangre de manera integral. No te limites a señalar valores fuera de rango; quiero una evaluación completa de todos los parámetros. Explica cómo cada valor influye en la salud general, incluso si está dentro del rango normal, y destaca posibles tendencias o áreas de optimización. Considera aspectos como salud metabólica, inflamación, función hepática y renal, salud cardiovascular, equilibrio hormonal y estado nutricional. Además, proporciona recomendaciones prácticas basadas en la interpretación de los valores y posibles ajustes en la dieta, estilo de vida que podrían mejorar la salud a largo plazo. Este análisis quiero que lo hagas en lenguaje natural y en formato Markdown. 

Adicionalmente, los datos de la analítica de sangre los quiero en formato JSON. Asegúrate de que el JSON sea válido y esté claramente estructurado. Si falta un valor en el análisis, le pones null; excepto a los códigos LOINC que ya están predeterminados en la estructura y nunca los pongas null a los predeterminados. No cambies los nombres de los valores predeterminados, por ejemplo, Leucocitos (recuento) es igual a Leucocitos y así con el resto de los valores. No cambies los nombre_normalizado, ya te los he dejado predeterminados. El JSON debe seguir esta estructura:
{
  "paciente": {
    "dni": "string",
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
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "leucocitos"
  },
  {
    "nombre": "Neutrófilos",
    "codigo_loinc": "770-8",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "neutrofilos"
  },
  {
    "nombre": "Linfocitos",
    "codigo_loinc": "731-0",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "linfocitos"
  },
  {
    "nombre": "Monocitos",
    "codigo_loinc": "742-7",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "monocitos"
  },
  {
    "nombre": "Eosinófilos",
    "codigo_loinc": "713-8",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "eosinofilos"
  },
  {
    "nombre": "Basófilos",
    "codigo_loinc": "706-2",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "basofilos"
  },
  {
    "nombre": "Hematíes",
    "codigo_loinc": "789-8",
    "valor": "string",
    "unidad": "10^12/L",
    "observaciones": "string",
    "nombre_normalizado": "hematies"
  },
  {
    "nombre": "Hemoglobina",
    "codigo_loinc": "718-7",
    "valor": "string",
    "unidad": "g/dL",
    "observaciones": "string",
    "nombre_normalizado": "hemoglobina"
  },
  {
    "nombre": "Hematocrito",
    "codigo_loinc": "4544-3",
    "valor": "string",
    "unidad": "%",
    "observaciones": "string",
    "nombre_normalizado": "hematocrito"
  },
  {
    "nombre": "Índice de Distribución de Hematíes (IDH)",
    "codigo_loinc": "788-9",
    "valor": "string",
    "unidad": "%",
    "observaciones": "string",
    "nombre_normalizado": "idh"
  },
  {
    "nombre": "Volumen Corpuscular Medio (VCM)",
    "codigo_loinc": "787-1",
    "valor": "string",
    "unidad": "fL",
    "observaciones": "string",
    "nombre_normalizado": "vcm"
  },
  {
    "nombre": "Hemoglobina Corpuscular Media (HCM)",
    "codigo_loinc": "785-5",
    "valor": "string",
    "unidad": "pg",
    "observaciones": "string",
    "nombre_normalizado": "hcm"
  },
  {
    "nombre": "Concentración de Hemoglobina Corpuscular Media (CHCM)",
    "codigo_loinc": "786-3",
    "valor": "string",
    "unidad": "g/dL",
    "observaciones": "string",
    "nombre_normalizado": "chcm"
  },
  {
    "nombre": "Plaquetas",
    "codigo_loinc": "777-3",
    "valor": "string",
    "unidad": "10^9/L",
    "observaciones": "string",
    "nombre_normalizado": "plaquetas"
  },
  {
    "nombre": "Volumen Plaquetario Medio (VPM)",
    "codigo_loinc": "32623-1",
    "valor": "string",
    "unidad": "fL",
    "observaciones": "string",
    "nombre_normalizado": "volumen plaquetario medio"
  },
  {
    "nombre": "Índice de Distribución Plaquetaria (IDP)",
    "codigo_loinc": "28542-9",
    "valor": "string",
    "unidad": "%",
    "observaciones": "string",
    "nombre_normalizado": "idp"
  },
  {
    "nombre": "VSG primera hora (Velocidad de sedimentación globular)",
    "codigo_loinc": "4537-7",
    "valor": "string",
    "unidad": "mm/h",
    "observaciones": "string",
    "nombre_normalizado": "vsg"
  },
  {
    "nombre": "Hemoglobina A1C",
    "codigo_loinc": "4548-4",
    "valor": "string",
    "unidad": "%",
    "observaciones": "string",
    "nombre_normalizado": "hemoglobina a1c"
  },
  {
    "nombre": "Ferritina",
    "codigo_loinc": "2276-4",
    "valor": "string",
    "unidad": "ng/mL",
    "observaciones": "string",
    "nombre_normalizado": "ferritina"
  },
  {
    "nombre": "Protrombina (Tiempo de Protrombina)",
    "codigo_loinc": "5964-2",
    "valor": "string",
    "unidad": "segundos",
    "observaciones": "string",
    "nombre_normalizado": "protrombina"
  },
  {
    "nombre": "Glucosa",
    "codigo_loinc": "2345-7",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "glucosa"
  },
  {
    "nombre": "Lipoproteína (a)",
    "codigo_loinc": "10835-7",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "lipoproteina (a)"
  },
  {
    "nombre": "Creatinina",
    "codigo_loinc": "2160-0",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "creatinina"
  },
  {
    "nombre": "Ácido Úrico",
    "codigo_loinc": "3084-1",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "acido urico"
  },
  {
    "nombre": "Colesterol Total",
    "codigo_loinc": "2093-3",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "colesterol total"
  },
  {
    "nombre": "Triglicéridos",
    "codigo_loinc": "2571-8",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "trigliceridos"
  },
  {
    "nombre": "HDL",
    "codigo_loinc": "2085-9",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "hdl"
  },
  {
    "nombre": "LDL",
    "codigo_loinc": "2089-1",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "ldl"
  },
  {
    "nombre": "VLDL",
    "codigo_loinc": "13457-7",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "vldl"
  },
  {
    "nombre": "Apolipoproteína B",
    "codigo_loinc": "49747-5",
    "valor": "string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "apo b"
  },
  {
    "nombre": "Proteínas Totales",
    "codigo_loinc": "2885-2",
    "valor":"string",
    "unidad": "g/dL",
    "observaciones": "string",
    "nombre_normalizado": "proteinas totales"
  },
  {
    "nombre": "Calcio",
    "codigo_loinc": "17861-6",
    "valor":"string",
    "unidad": "mg/dL",
    "observaciones": "string",
    "nombre_normalizado": "calcio"
  },
  {
    "nombre": "Vitamina D",
    "codigo_loinc": "49498-9",
    "valor": "string",
    "unidad": "ng/mL",
    "observaciones": "string",
    "nombre_normalizado": "vitamina d"
  },
  {
    "nombre": "PSA (Antígeno Prostático Específico)",
    "codigo_loinc": "2857-1",
    "valor": "string",
    "unidad": "ng/mL",
    "observaciones": "string",
    "nombre_normalizado": "psa"
  }
  ]
}
Responde únicamente con la información solicitada, sin saludos ni introducciones.

Si el archivo subido no es un análisis de sangre, responde únicamente con: “El archivo subido no es una analítica de sangre.”`;

const attiaPrompt =
  "Analiza esta analítica de sangre aplicando criterios similares a los del Dr. Peter Attia, con un enfoque en longevidad y mejora de la calidad de vida a largo plazo.";

const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

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
  promptComplejoEnglish,
  systemInstruction,
  attiaPrompt,
};
