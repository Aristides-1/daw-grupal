from rest_framework import serializers
from citas.serializers import CitaSerializer
from .models import Atencion


class AtencionSerializer(serializers.ModelSerializer):
    cita_detalle = CitaSerializer(source='cita', read_only=True)

    class Meta:
        model = Atencion
        fields = ['id', 'motivo', 'tratamiento', 'observaciones',
                  'cita', 'cita_detalle']
