from rest_framework import serializers

from .models import Atencion


class AtencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atencion
        fields = "__all__"

    def validate_cita(self, value):
        if value.estado == "cancelada":
            raise serializers.ValidationError(
                "No se puede registrar una atención sobre una cita cancelada."
            )

        queryset = Atencion.objects.filter(cita=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Esta cita ya tiene una atención registrada."
            )

        return value

    def validate_motivo(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "El motivo de la atención es obligatorio."
            )

        return value

    def validate_diagnostico(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "El diagnóstico es obligatorio."
            )

        return value

    def validate_tratamiento(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "El tratamiento es obligatorio."
            )

        return value