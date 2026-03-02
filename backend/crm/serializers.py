from rest_framework import serializers
from .models import Cliente, Oportunidad


class OportunidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oportunidad
        fields = '__all__'
        read_only_fields = ['fecha_creacion']


class ClienteSerializer(serializers.ModelSerializer):
    oportunidades = OportunidadSerializer(many=True, read_only=True)
    total_oportunidades = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['fecha_registro']

    def get_total_oportunidades(self, obj):
        return obj.oportunidades.count()


class ClienteListSerializer(serializers.ModelSerializer):
    """Serializer liviano para listados (sin anidar oportunidades)"""
    total_oportunidades = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = '__all__'
        read_only_fields = ['fecha_registro']

    def get_total_oportunidades(self, obj):
        return obj.oportunidades.count()