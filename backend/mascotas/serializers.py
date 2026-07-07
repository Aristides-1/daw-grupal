
from django.utils import timezone
from rest_framework import serializers
from .models import Mascota

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascota
        fields = '__all__'

    def validate_fecha_nacimiento(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError(
                "La fecha de nacimiento no puede ser una fecha futura."
            )
        return value