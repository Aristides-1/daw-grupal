from django.db import models

class Mascota(models.Model):
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=50)

    sexo = models.CharField(
        max_length=10,
        choices=[
            ("M", "Macho"),
            ("F", "Hembra"),
        ]
    )

    fecha_nacimiento = models.DateField()
    peso = models.DecimalField(max_digits=5, decimal_places=2)

    cliente = models.ForeignKey(
        "clientes.Cliente",
        on_delete=models.CASCADE,
        related_name="mascotas"
    )

    def __str__(self):
        return self.nombre