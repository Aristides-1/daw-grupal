from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

    #aseguramos que se ingrese un DNI valido, con 8 digitos numericos
    def validate_documento(self, value):
        
            if len(value) != 8 or not value.isdigit():
                raise serializers.ValidationError(
                    "El DNI debe tener exactamente 8 dígitos numéricos."
                )

            return value

    #aseguramos que se ingrese un nombre, un apellido y tambien un telefono, que no sean vacios y numerico

        if not value.strip():
            raise serializers.ValidationError(
                "Los nombres son obligatorios."
            )

        return value

    def validate_apellidos(self, value):

        if not value.strip():
            raise serializers.ValidationError(
                "Los apellidos son obligatorios."
            )

        return value

    def validate_telefono(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "El teléfono debe contener solo números."
            )
        return value