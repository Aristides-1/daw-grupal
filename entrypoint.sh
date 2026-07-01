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

echo "Iniciando Django..."
python manage.py runserver 0.0.0.0:8000