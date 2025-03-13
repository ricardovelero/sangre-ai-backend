const promptSencillo =
  "Este es un análisis de una analítica de sangre. Por favor, extrae los valores clave y genera un análisis médico detallado. ¿Qué recomendaciones me puedes ofrecer?";

const promptComplejo = `Analiza esta analítica de sangre de manera integral. No te limites a señalar los valores fuera de rango; quiero una evaluación completa de todos los parámetros. Explica cómo cada valor influye en la salud general, incluso si está dentro del rango normal, y destaca posibles tendencias o áreas de optimización. Considera aspectos como la salud metabólica, inflamación, función hepática, renal, cardiovascular, equilibrio hormonal y estado nutricional. Además, proporciona recomendaciones prácticas basadas en la interpretación de los valores y posibles ajustes en la dieta, estilo de vida o suplementación que podrían mejorar la salud a largo plazo.

Quiero que la respuesta incluya un análisis en lenguaje natural en formato markdown, y también los datos de la analítica en formato JSON. El JSON debe estar delimitado al principio con <<<json, al final >>>, y el JSON debe tener esta estructura:
{
  datos_analitica: {
    "aqui vacias por clave e informacion todo lo relevante de la analítica"
  }
}
Asegúrate de que el JSON sea válido y que la información se organice de manera clara y estructurada. El texto markdown puede preceder o seguir al bloque JSON, pero el JSON debe estar claramente delimitado para facilitar su extracción y procesamiento. Responde solo con la información solicitada, sin saludar ni introducción.
`;

module.exports = {
  promptSencillo,
  promptComplejo,
};
