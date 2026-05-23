#!/bin/bash
set -e

echo "Waiting for PostgreSQL..."
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -q; do
    sleep 1
done
echo "PostgreSQL is ready."

python manage.py makemigrations users stories comments favorites --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn bookmora.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
