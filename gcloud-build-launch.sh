#!/bin/bash

echo "♻️  Iniciando gcloud 'sangre-ai-backend'..."

# Cargar variables desde .env
set -a
source .env
set +a

# Construir imagen local
docker build --platform=linux/amd64 -t sangre-ai-backend .

# Etiquetar y subir a GCR
docker tag sangre-ai-backend gcr.io/sangre-ai/sangre-ai-backend
docker push gcr.io/sangre-ai/sangre-ai-backend

# Desplegar en Cloud Run
gcloud run deploy sangre-ai-backend \
  --image gcr.io/sangre-ai/sangre-ai-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=$NODE_ENV,TOKEN_KEY=$TOKEN_KEY,REFRESH_TOKEN_KEY=$REFRESH_TOKEN_KEY,GEMINI_API_KEY=$GEMINI_API_KEY,MONGO_URI=$MONGO_URI,EMAILS_SECRET=$EMAILS_SECRET,FRONTEND_URL=https://sangre-ai-react.vercel.app