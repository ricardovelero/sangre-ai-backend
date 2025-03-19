const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

const promptComplejo = `Eres una IA especializada en extraer y estructurar datos de análisis de sangre de pacientes. Analiza este análisis de sangre de manera integral. No te limites a señalar valores fuera de rango; quiero una evaluación completa de todos los parámetros. Explica cómo cada valor influye en la salud general, incluso si está dentro del rango normal, y destaca posibles tendencias o áreas de optimización. Considera aspectos como salud metabólica, inflamación, función hepática y renal, salud cardiovascular, equilibrio hormonal y estado nutricional. Además, proporciona recomendaciones prácticas basadas en la interpretación de los valores y posibles ajustes en la dieta, estilo de vida o suplementación que podrían mejorar la salud a largo plazo. Este analisis quiero que lo hagas en lenguaje natural y en formato Markdown.

Adicionalmente, los datos del análisis de sangre los quiero en formato JSON. El JSON debe estar delimitado al inicio con <<<json y al final con >>>, y debe seguir esta estructura:
{
  "paciente": {
    "id": "string", // DNI, NIE, numero de identificacion, etc
    "nombre": "string",
    "apellidos": "string",
    "fecha_nacimiento": "YYYY-MM-DDTHH:mm:ss.sssZ",
    "sexo": "string"
  },
  "fecha_toma_muestra": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "fecha_informe": "YYYY-MM-DDTHH:mm:ss.sssZ",
  "laboratorio": "string",
  "medico": "string",
  "resultados": [
    { // aqui el esquema de cada analito. Utiliza valores absolutos. 
      "nombre": string,
      "codigo_loinc": string, // busca el codigo loinc del analito analizado.
      "valor": number, 
      "unidad": string, 
      "rango_referencia": {
        "minimo": number
        "maximo": number
      },
      "indicador": ALTO | BAJO | NORMAL, // un enum
      "observaciones": string // Da una breve observación como si fueras un medico
    },
    { // En resultados de otras pruebas como orina o heces. Agregar una descripcion, aquí un ejemplo:
      "nombre": "orina",
      "descripcion": "Sección de análisis de orina",
      "secciones": [
        {
          "nombre_seccion": "parametros_generales",
          "parametros": {
            "color": {
              "valor": "Amarillo claro",
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            },
            "ph": {
              "valor": 6.0,
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            },
            "densidad": {
              "valor": 1.015,
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            }
          }
        },
        {
          "nombre_seccion": "dipstick",
          "parametros": {
            "leucocitos": {
              "valor": null,
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            },
            "nitritos": {
              "valor": null,
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            },
            "proteinas": {
              "valor": null,
              "unidad": null,
              "rango_referencia": null,
              "indicador": null
            }
          }
        }
      ]
    },
    { // ejemplo de heces:
      "nombre": "heces",
      "descripcion": "Sección de análisis de heces",
      "parametros": {
        "color": {
          "valor": "Marrón",
          "unidad": null,
          "rango_referencia": null,
          "indicador": null
        },
        "consistencia": {
          "valor": "Normal",
          "unidad": null,
          "rango_referencia": null,
          "indicador": null
        },
        "sangre_oculta": {
          "valor": null,
          "unidad": null,
          "rango_referencia": null,
          "indicador": null
        }
      }
    }
  ]
}
Asegúrate de que el JSON sea válido y esté claramente estructurado. Si falta un valor en el análisis, le pones null.

El texto de tu analisis en lenguaje natural en Markdown puede preceder o seguir al bloque JSON, pero el JSON debe estar claramente delimitado para facilitar su extracción y procesamiento.

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
