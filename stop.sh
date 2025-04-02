#!/bin/bash

echo "🛑 Deteniendo y eliminando contenedor 'sangre-ai-backend'..."
docker stop sangre-ai-backend && docker rm sangre-ai-backend