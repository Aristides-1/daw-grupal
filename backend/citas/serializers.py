from rest_framework import serializers
from .models import Cita

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'

    #definimos cita real, sin que la cita sea antes del dia actual
    def validate_fecha(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError()

        return value
        
    def validate(self, data):
        veterinario = data.get('veterinario')
        fecha = data.get('fecha')
        hora = data.get('hora')

        query = Cita.objects.filter(veterinario=veterinario, fecha=fecha, hora=hora)
        if self.instance:
            query = query.exclude(pk=self.instance.pk)
        if query.exists():
            raise serializers.ValidationError("El veterinario ya tiene una cita programada en ese horario.")
        return data