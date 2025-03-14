const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

const promptComplejo = `Eres una IA especializada en extraer y estructurar datos de análisis de sangre de pacientes. Analiza este análisis de sangre de manera integral. No te limites a señalar valores fuera de rango; quiero una evaluación completa de todos los parámetros. Explica cómo cada valor influye en la salud general, incluso si está dentro del rango normal, y destaca posibles tendencias o áreas de optimización. Considera aspectos como salud metabólica, inflamación, función hepática y renal, salud cardiovascular, equilibrio hormonal y estado nutricional.

Además, proporciona recomendaciones prácticas basadas en la interpretación de los valores y posibles ajustes en la dieta, estilo de vida o suplementación que podrían mejorar la salud a largo plazo.

Quiero que la respuesta incluya:
	•	Un análisis en lenguaje natural en formato Markdown.
	•	Los datos del análisis de sangre en formato JSON.

El JSON debe estar delimitado al inicio con <<<json y al final con >>>, y debe seguir esta estructura:
{
  "paciente": {
    "nombre": "string",
    "apellidos": "string",
    "fecha_nacimiento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "sexo": "string",
    "fecha_toma_muestra": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "laboratorio": "string",
    "medico": "string"
  },
  "analitica": {
    "serie_blanca": {
      "leucocitos": "N/A",
      "neutrofilos": "N/A",
      "linfocitos": "N/A",
      "monocitos": "N/A",
      "eosinofilos": "N/A",
      "basofilos": "N/A"
    },
    "serie_roja": {
      "hematies": "N/A",
      "hemoglobina": "N/A",
      "hematocrito": "N/A",
      "VCM": "N/A",
      "HCM": "N/A",
      "CHCM": "N/A"
    },
    "serie_plaquetar": {
      "plaquetas": "N/A",
      "VPM": "N/A"
    },
    "eritrosedimentacion": {
      "VSG": "N/A"
    },
    "bioquimica_clinica": {
      "glucosa": "N/A",
      "hemoglobina_glicosilada_a1c": "N/A",
      "colesterol_total": "N/A",
      "HDL": "N/A",
      "LDL": "N/A",
      "trigliceridos": "N/A",
      "creatinina": "N/A",
      "urea": "N/A",
      "acido_urico": "N/A",
      "transaminasas": {
        "TGO_AST": "N/A",
        "TGP_ALT": "N/A"
      },
      "GGT": "N/A",
      "fosfatasa_alcalina": "N/A",
      "proteinas_totales": "N/A",
      "albumina": "N/A"
    },
    "pruebas_reumaticas": {
      "proteina_c_reactiva": "N/A",
      "factor_reumatoide": "N/A",
      "anticuerpos_antinucleares": "N/A",
      "antiCCP": "N/A"
    },
    "hormonas": {
      "TSH": "N/A",
      "T3": "N/A",
      "T4": "N/A",
      "FSH": "N/A",
      "LH": "N/A",
      "testosterona": "N/A",
      "estradiol": "N/A",
      "progesterona": "N/A",
      "prolactina": "N/A"
    },
    "marcadores": {
      "PSA": "N/A",
      "CEA": "N/A",
      "AFP": "N/A",
      "CA_125": "N/A",
      "CA_19_9": "N/A"
    },
    "orina": {
      "aspecto": "N/A",
      "color": "N/A",
      "densidad": "N/A",
      "pH": "N/A",
      "glucosa": "N/A",
      "proteinas": "N/A",
      "hematies": "N/A",
      "leucocitos": "N/A",
      "cilindros": "N/A",
      "bacterias": "N/A"
    },
    "heces": {
      "color": "N/A",
      "consistencia": "N/A",
      "sangre_oculta": "N/A",
      "parasitos": "N/A"
    },
    "otros": {
        "vitamina_d3": "N/A"
     }
  }
}
Asegúrate de que el JSON sea válido y esté claramente estructurado.
•Si falta un valor en el análisis, reemplázalo con "N/D".
•Si hay valores adicionales no incluidos en el esquema, agrégales en el campo "otros" sin modificar la estructura base.

El texto en Markdown puede preceder o seguir al bloque JSON, pero el JSON debe estar claramente delimitado para facilitar su extracción y procesamiento.

Responde únicamente con la información solicitada, sin saludos ni introducciones.

Si el archivo subido no es un análisis de sangre, responde únicamente con:
“El archivo subido no es un análisis de sangre.”`;

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
