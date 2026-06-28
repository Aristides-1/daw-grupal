from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Rol, Usuario


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'nombre', 'descripcion']


class UsuarioSerializer(serializers.ModelSerializer):
    # Lectura: detalle del rol anidado. Escritura: id del rol.
    rol_detalle = RolSerializer(source='rol', read_only=True)
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'rol', 'rol_detalle', 'estado', 'is_active', 'password',
        ]

    def create(self, validated_data):
        """Crea el usuario hasheando la contraseña correctamente."""
        password = validated_data.pop('password', None)
        usuario = Usuario(**validated_data)
        if password:
            usuario.set_password(password)
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        """Actualiza el usuario; si viene password, la re-hashea."""
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Añade el rol al payload del token y a la respuesta del login."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['rol'] = getattr(getattr(user, 'rol', None), 'nombre', None)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['rol'] = getattr(getattr(self.user, 'rol', None), 'nombre', None)
        data['is_superuser'] = self.user.is_superuser
        return data
