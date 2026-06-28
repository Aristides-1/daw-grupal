from django.db import models
from clientes.models import Cliente

class Mascota(models.Model):
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=50)
    sexo = models.CharField(max_length=10)
    fecha_nacimiento = models.DateField()
    peso = models.FloatField()

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name="mascotas"
    )

    def __str__(self):
        return self.nombre