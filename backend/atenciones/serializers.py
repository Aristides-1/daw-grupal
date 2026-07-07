from rest_framework import serializers
from .models import Atencion


class AtencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atencion
        fields = '__all__'

    def validate_cita(self, value):
        if value.estado == "cancelada":
            raise serializers.ValidationError(
                "No se puede registrar una atención sobre una cita cancelada."
            )
        return value