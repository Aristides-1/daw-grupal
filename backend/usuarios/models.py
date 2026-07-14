from django.contrib.auth.models import AbstractUser
from django.db import models


class Rol(models.Model):
    ADMINISTRADOR = "administrador"
    RECEPCIONISTA = "recepcionista"
    VETERINARIO = "veterinario"

    nombre = models.CharField(
        max_length=50,
        unique=True,
    )

    descripcion = models.TextField(
        blank=True,
    )

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser):
    rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="usuarios",
    )

    estado = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.username