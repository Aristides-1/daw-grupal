#!/bin/sh

echo "Esperando a PostgreSQL..."

while ! python manage.py check > /dev/null 2>&1
do
    echo "PostgreSQL no disponible, esperando..."
    sleep 2
done

echo "Base de datos disponible."

echo "Aplicando migraciones..."
python manage.py migrate

echo "Verificando superusuario..."

python manage.py createsuperuser --noinput || echo "Superusuario ya existe o no se pudo crear, continuando..."

echo "Iniciando Django..."

exec python manage.py runserver 0.0.0.0:8000