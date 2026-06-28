from django.db import models

class Receta(models.Model):
    medicamentos = models.CharField(max_length=100)
    indicaciones = models.TextField()

    atencion = models.ForeignKey(
        "atenciones.Atencion",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.medicamentos