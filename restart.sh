#!/bin/bash

echo "♻️  Reiniciando contenedor 'sangre-ai-backend'..."

docker build -t sangre-ai-backend .
./stop.sh
sleep 2
./start.sh