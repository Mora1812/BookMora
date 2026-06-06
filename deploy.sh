#!/bin/bash
# BookMora — script de actualización para moramj.online
#
# Este script se ejecuta EN LA VPS, dentro de la carpeta del proyecto
# (donde están docker-compose.prod.yml, .env.prod y nginx/):
#
#   bash deploy.sh
#
# IMPORTANTE: antes de correrlo hay que construir y subir las imágenes
# actualizadas a Docker Hub desde la máquina de desarrollo (este script
# NO compila nada — solo descarga las imágenes ya publicadas):
#
#   docker build -t mora1812/bookmora-backend:latest ./backend
#   docker push mora1812/bookmora-backend:latest
#   docker build -t mora1812/bookmora-frontend:latest ./frontend
#   docker push mora1812/bookmora-frontend:latest

set -e

COMPOSE="docker-compose -f docker-compose.prod.yml"

echo "=== BookMora — actualizando despliegue en moramj.online ==="

# 1. Descargar las imágenes más recientes publicadas en Docker Hub
echo ">> Descargando imágenes actualizadas..."
$COMPOSE pull

# 2. Recrear los contenedores con las imágenes nuevas
echo ">> Recreando contenedores (backend, frontend, nginx)..."
$COMPOSE up -d --force-recreate

# 3. Esperar a que el backend esté listo para recibir comandos
echo ">> Esperando a que el backend arranque..."
sleep 8

# 4. Ejecutar migraciones pendientes de la base de datos
echo ">> Ejecutando migraciones..."
$COMPOSE exec -T backend python manage.py migrate --noinput

# 5. Recolectar archivos estáticos (CSS/JS del admin de Django, etc.)
echo ">> Recolectando archivos estáticos..."
$COMPOSE exec -T backend python manage.py collectstatic --noinput

# 6. (Opcional) Poblar/actualizar el catálogo de muestra.
#    Ambos comandos son idempotentes: no duplican nada si ya existen
#    los géneros o las historias. Descomenta si necesitas (re)cargarlos.
# echo ">> Poblando catálogo de muestra..."
# $COMPOSE exec -T backend python manage.py seed_genres
# $COMPOSE exec -T backend python manage.py seed_demo_catalog

echo ""
echo "=== ¡Despliegue actualizado! ==="
echo "Sitio:  https://moramj.online"
echo "Admin:  https://moramj.online/admin"
