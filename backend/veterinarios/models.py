from django.db import models

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Veterinario(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()

    especialidad = models.ForeignKey(
        Especialidad,
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"