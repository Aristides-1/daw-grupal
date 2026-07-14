from django.db import models
from atenciones.models import Atencion

class Receta(models.Model):
    medicamentos = models.CharField(max_length=100)
    indicaciones = models.TextField(blank=False)

    atencion = models.ForeignKey(Atencion, on_delete=models.CASCADE)

    def __str__(self):
        return self.medicamentos