from rest_framework import serializers
from .models import Veterinario, Especialidad

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'


class VeterinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veterinario
        fields = '__all__'
        
    def validate_telefono(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "El teléfono debe contener solo números."
            )
        return value