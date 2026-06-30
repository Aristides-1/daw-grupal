from rest_framework import serializers
from .models import Veterinario, Especialidad

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'


class VeterinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veterinario
        fields = '__all__'