#!/bin/bash

echo "♻️  Iniciando gcloud 'sangre-ai-backend'..."

# Cargar variables desde .env
set -a
source .env
set +a
docker build -t sangre-ai-backend .

gcloud run deploy sangre-ai-backend \
  --image gcr.io/sangre-ai/sangre-ai-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=$NODE_ENV,TOKEN_KEY=$TOKEN_KEY,REFRESH_TOKEN_KEY=$REFRESH_TOKEN_KEY,GEMINI_API_KEY=$GEMINI_API_KEY,MONGO_URI=$MONGO_URI,EMAILS_SECRET=$EMAILS_SECRET,FRONTEND_URL=https://sangre-ai-react.vercel.app