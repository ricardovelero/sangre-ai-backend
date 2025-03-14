const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

const promptComplejo = `Analyze this blood test comprehensively. Do not limit yourself to pointing out values that are out of range; I want a complete evaluation of all parameters. Explain how each value influences overall health, even if it falls within the normal range, and highlight possible trends or areas for optimization. Consider aspects such as metabolic health, inflammation, liver and kidney function, cardiovascular health, hormonal balance, and nutritional status.

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
};
