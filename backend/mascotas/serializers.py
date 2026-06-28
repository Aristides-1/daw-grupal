from rest_framework import serializers
from clientes.serializers import ClienteSerializer
from .models import Mascota


class MascotaSerializer(serializers.ModelSerializer):
    # Escritura por id (campo `cliente`); lectura con el cliente anidado.
    cliente_detalle = ClienteSerializer(source='cliente', read_only=True)

    class Meta:
        model = Mascota
        fields = ['id', 'nombre', 'especie', 'raza', 'sexo',
                  'fecha_nacimiento', 'peso', 'cliente', 'cliente_detalle']
