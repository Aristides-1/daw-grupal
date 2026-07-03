from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "email",
            "password",
            "is_active",
            "rol"
        ]

    #metodo 
    def create(self, validated_data):
        password = validated_data.pop("password")
        rol = validated_data.pop("rol", None)
        user = Usuario(**validated_data)
        user.set_password(password)  # CLAVE (hash correcto)

        # funcion para proporcionar rol al usuario si se proporciona
        if rol:
            user.rol = rol
        user.is_active = True  
        user.save()

        return user