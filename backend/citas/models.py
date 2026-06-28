from django.db import models
from mascotas.models import Mascota
from veterinarios.models import Veterinario

class Cita(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, default="pendiente")

    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE)
    veterinario = models.ForeignKey(Veterinario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cita {self.fecha} - {self.mascota.nombre}"