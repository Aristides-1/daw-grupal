from rest_framework import serializers

from .models import Receta


class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = "__all__"

    def validate_medicamentos(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Los medicamentos son obligatorios."
            )

        return value

    def validate_indicaciones(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Las indicaciones son obligatorias."
            )

        return value