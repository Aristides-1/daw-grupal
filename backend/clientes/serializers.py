from rest_framework import serializers
from .models import Cliente

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

# aseguramos que se ingrese un DNI valido, con 8 digitos numericos
def validate_documento(self, value):
       
        if len(value) != 8 or not value.isdigit():
            raise serializers.ValidationError(
                "El DNI debe tener exactamente 8 dígitos numéricos."
            )

        return value