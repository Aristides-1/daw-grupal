from django.db import models
from citas.models import Cita

class Atencion(models.Model):
    motivo = models.TextField()
    sintomas = models.TextField()
    diagnostico = models.TextField()
    tratamiento = models.TextField()
    observaciones = models.TextField(blank=True)

    cita = models.OneToOneField(Cita, on_delete=models.CASCADE)

    def __str__(self):
        return f"Atención {self.id}"