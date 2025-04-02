#!/bin/bash

echo "🚀 Iniciando contenedor 'sangre-ai-backend' en puerto 8080..."

# Cargar variables desde .env
set -a
source .env
set +a

docker run -d -p 8080:8080 \
  -e NODE_ENV=$NODE_ENV \
  -e TOKEN_KEY=$TOKEN_KEY \
  -e REFRESH_TOKEN_KEY=$REFRESH_TOKEN_KEY \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  -e MONGO_URI=$MONGO_URI \
  -e EMAILS_SECRET=$EMAILS_SECRET \
  -e FRONTEND_URL=$FRONTEND_URL \
  --name sangre-ai-backend \
  sangre-ai-backend