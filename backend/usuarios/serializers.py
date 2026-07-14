from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Rol, Usuario


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = [
            "id",
            "nombre",
            "descripcion",
        ]

    def validate_nombre(self, value):
        return value.strip().lower()


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        validators=[validate_password],
    )

    rol_nombre = serializers.CharField(
        source="rol.nombre",
        read_only=True,
    )

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "is_active",
            "estado",
            "rol",
            "rol_nombre",
        ]

        read_only_fields = [
            "id",
            "rol_nombre",
        ]

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError(
                {
                    "password": "La contraseña es obligatoria."
                }
            )

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")

        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()

        return usuario

    def update(self, instance, validated_data):
        password = validated_data.pop(
            "password",
            None,
        )

        for atributo, valor in validated_data.items():
            setattr(instance, atributo, valor)

        if password:
            instance.set_password(password)

        instance.save()

        return instance


class UsuarioActualSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(
        source="rol.nombre",
        read_only=True,
    )

    es_administrador = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "rol",
            "rol_nombre",
            "estado",
            "is_superuser",
            "es_administrador",
        ]

    def get_es_administrador(self, usuario):
        return (
            usuario.is_superuser
            or (
                usuario.rol is not None
                and usuario.rol.nombre == Rol.ADMINISTRADOR
            )
        )