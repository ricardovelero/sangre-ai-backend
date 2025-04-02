#!/bin/bash

echo "🧹 Limpiando contenedores, imágenes y volúmenes sin usar..."

# Elimina contenedores detenidos
docker container prune -f

# Elimina imágenes sin usar
docker image prune -a -f

# Elimina volúmenes sin referenciar
docker volume prune -f

echo "✅ Limpieza completada."
