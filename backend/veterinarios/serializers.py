from rest_framework import serializers
from .models import Especialidad, Veterinario


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ['id', 'nombre', 'descripcion']


class VeterinarioSerializer(serializers.ModelSerializer):
    especialidad_detalle = EspecialidadSerializer(source='especialidad', read_only=True)

    class Meta:
        model = Veterinario
        fields = ['id', 'nombres', 'apellidos', 'telefono', 'correo',
                  'especialidad', 'especialidad_detalle']
