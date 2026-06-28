from django.db import models

class Cita(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()

    estado = models.CharField(
        max_length=20,
        choices=[
            ("pendiente", "Pendiente"),
            ("confirmada", "Confirmada"),
            ("cancelada", "Cancelada"),
            ("atendida", "Atendida"),
        ],
        default="pendiente"
    )

    mascota = models.ForeignKey(
        "mascotas.Mascota",
        on_delete=models.CASCADE
    )

    veterinario = models.ForeignKey(
        "veterinarios.Veterinario",
        on_delete=models.CASCADE
    )

    class Meta:
        # Un veterinario no puede tener dos citas en la misma fecha y hora.
        constraints = [
            models.UniqueConstraint(
                fields=["veterinario", "fecha", "hora"],
                name="unique_veterinario_fecha_hora",
            )
        ]

    def __str__(self):
        return f"Cita {self.fecha} - {self.mascota.nombre}"