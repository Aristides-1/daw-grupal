from rest_framework import serializers
from mascotas.serializers import MascotaSerializer
from veterinarios.serializers import VeterinarioSerializer
from .models import Cita


class CitaSerializer(serializers.ModelSerializer):
    mascota_detalle = MascotaSerializer(source='mascota', read_only=True)
    veterinario_detalle = VeterinarioSerializer(source='veterinario', read_only=True)

    class Meta:
        model = Cita
        fields = ['id', 'fecha', 'hora', 'estado',
                  'mascota', 'mascota_detalle',
                  'veterinario', 'veterinario_detalle']
