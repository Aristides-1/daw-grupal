from django.db import models

class Atencion(models.Model):
    motivo = models.TextField()
    tratamiento = models.TextField()
    observaciones = models.TextField(blank=True)

    cita = models.OneToOneField(
        "citas.Cita",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"Atención {self.cita.mascota.nombre} - {self.cita.fecha}"