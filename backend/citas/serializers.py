from rest_framework import serializers
from .models import Cita

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'

    #definimos cita real, sin que la cita sea antes del dia actual
    def validate_fecha(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError()

        return value