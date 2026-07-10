from rest_framework import serializers
from .models import Receta

class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = '__all__'

    def validate_indicaciones(self, value):
        if not value.strip():
            raise serializers.ValidationError("Las indicaciones son obligatorias.")
        return value