# 🩸 SangreAI - Backend

Este es el servidor que da donde se maneja la subida de archivos de la aplicación Sangre AI. Desde aquí manejamos la subida de archivos, autenticacion, y manejo de Mongo DB. Sangre AI es una plicación web para subir análisis de sangre en formato PDF o imagen, extraer automáticamente los datos mediante una API de IA, almacenarlos en una base de datos y permitir futuras consultas y análisis.

## Características

- Subida de archivos (PDF o imágenes) con validaciones de seguridad
- Procesamiento mediante API de inteligencia artificial (ChatGPT / Gemini)
- Análisis inteligente y visualización de resultados
- Autenticación segura con JWT Tokens
- Almacenamiento en MongoDB
- Encriptación de datos sensibles

---

## Tecnologías utilizadas

### Backend

- Servidor Node.js con JWT tokens para autenticación
- API de IA (OpenAI / Gemini)
- Validación y parsing de archivos

### Base de datos

- MongoDB (vía MongoDB Atlas)
- Mogosh
- Patrón Repository + DTOs

### Autenticación

- JWT Tokens

### DevOps

- pnpm
- Jest
- GitHub Actions (CI/CD)
- Husky + Lint-Staged (pre-commits)

### Frontend

- React + Vite + TypeScript
- Zustand (gestión de estado)
- SWR (data fetching y revalidación)
- Tailwind CSS (estilos)
- Componentes Shadcn/ui

---

## Instalación local

```bash
git clone https://github.com/ricardovelero/sangre-ai-backend.git
cd sangre-ai-backend
pnpm install
pnpm dev
```

## Variables de entorno

Crea un archivo .env local con:

TOKEN_KEY=tu-token-super-secreto
REFRESH_TOKEN_KEY=tu-token-secreto-super-fresco
GEMINI_API_KEY=el key de tu cuenta con Google AI Studio
MONGO_URI=conexion con mongodb+srv
EMAILS_SECRET=clave secreta en Postmark App
FRONTEND_URL=http://localhost:5173 o el URL de tu frontend.

## Ejecutar Tests

pnpm test

## 🚧 Roadmap

- Procesamiento de archivos en paralelo con notificación al usuario con esté listo
- Ajustes generales
- Confirmación del correo electrónico al registrarse

## Licencia

GNU GPL

## Contribuciones

¡Las contribuciones son bienvenidas! Abre un issue o pull request con tus sugerencias o mejoras.

## Contacto

[Duda o soporte: https://solucionesio.es](https://solucionesio.es)
