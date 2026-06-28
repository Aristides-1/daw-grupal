from rest_framework import serializers
from atenciones.serializers import AtencionSerializer
from .models import Receta


class RecetaSerializer(serializers.ModelSerializer):
    atencion_detalle = AtencionSerializer(source='atencion', read_only=True)

    class Meta:
        model = Receta
        fields = ['id', 'medicamentos', 'indicaciones',
                  'atencion', 'atencion_detalle']
