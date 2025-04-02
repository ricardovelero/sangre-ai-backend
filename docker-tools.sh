#!/bin/bash

echo "🔧 Herramientas Docker - Proyecto Sangre AI"
echo "-------------------------------------------"
echo "1. Iniciar contenedor"
echo "2. Detener contenedor"
echo "3. Reiniciar contenedor"
echo "4. Limpiar Docker (contenedores/imágenes/volúmenes)"
echo "5. Salir"
echo ""

read -p "Selecciona una opción [1-5]: " opcion

case $opcion in
  1)
    ./start.sh
    ;;
  2)
    ./stop.sh
    ;;
  3)
    ./restart.sh
    ;;
  4)
    ./docker-clean.sh
    ;;
  5)
    echo "👋 Saliendo..."
    exit 0
    ;;
  *)
    echo "❌ Opción no válida."
    ;;
esac
