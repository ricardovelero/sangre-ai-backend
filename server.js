require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const routes = require("./routes"); // Archivo centralizado de rutas
const errorHandler = require("./middleware/errorHandler"); // Manejo de errores

const app = express();

// Configuración de CORS
app.use(cors());

// Seguridad con Helmet (protege contra ciertas vulnerabilidades)
app.use(helmet());

// Logger para ver las peticiones en consola
app.use(logger("dev"));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get("/", (_req, res) => {
  res.json({ message: "API funcionando correctamente 🚀" });
});

// Usar rutas centralizadas
app.use("/api", routes);

// Middleware de manejo de errores (debe ir después de las rutas)
app.use(errorHandler);

// Manejar rutas no definidas
app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
