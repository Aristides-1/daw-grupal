from rest_framework import serializers
from .models import Atencion

class AtencionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atencion
        fields = '__all__'