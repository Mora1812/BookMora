#!/bin/bash
# BookMora — deploy script for moramj.online
# Run this on the VPS: bash deploy.sh

set -e

echo "=== BookMora Deploy ==="

# 1. Pull latest code (if using git)
# git pull origin main

# 2. Build frontend
echo ">> Building frontend..."
cd frontend
npm install --production=false
VITE_API_URL=https://moramj.online/api npm run build
cd ..

# 3. Start/restart containers
echo ">> Starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 4. Wait for backend
echo ">> Waiting for backend..."
sleep 8

# 5. Run migrations
echo ">> Running migrations..."
docker exec bookmora_backend python manage.py migrate --noinput

# 6. Collect static files
echo ">> Collecting static files..."
docker exec bookmora_backend python manage.py collectstatic --noinput

echo ""
echo "=== Deploy complete! ==="
echo "Visit: https://moramj.online"
echo "Admin: https://moramj.online/admin  (user: admin)"
