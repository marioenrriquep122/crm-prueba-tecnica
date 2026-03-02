from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cliente, Oportunidad
from .serializers import ClienteSerializer, ClienteListSerializer, OportunidadSerializer
from .services import get_country_info


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()

    def get_serializer_class(self):
        # En list usamos el serializer liviano
        if self.action == 'list':
            return ClienteListSerializer
        return ClienteSerializer

    def get_queryset(self):
        queryset = Cliente.objects.all()
        # Filtro opcional por ciudad o empresa
        ciudad = self.request.query_params.get('ciudad')
        empresa = self.request.query_params.get('empresa')
        if ciudad:
            queryset = queryset.filter(ciudad__icontains=ciudad)
        if empresa:
            queryset = queryset.filter(empresa__icontains=empresa)
        return queryset

    @action(detail=True, methods=['get'], url_path='pais-info')
    def pais_info(self, request, pk=None):
        """Endpoint para obtener info del país según la ciudad del cliente"""
        cliente = self.get_object()
        # Usamos la ciudad como referencia para buscar país
        # En un caso real tendrías el campo país separado
        info = get_country_info(cliente.ciudad)
        return Response(info)


class OportunidadViewSet(viewsets.ModelViewSet):
    queryset = Oportunidad.objects.select_related('cliente').all()
    serializer_class = OportunidadSerializer

    def get_queryset(self):
        queryset = Oportunidad.objects.select_related('cliente').all()
        cliente_id = self.request.query_params.get('cliente')
        estado = self.request.query_params.get('estado')
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset