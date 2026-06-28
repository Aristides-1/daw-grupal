from django.db import models

class Cliente(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField(unique=True)
    direccion = models.TextField()

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"