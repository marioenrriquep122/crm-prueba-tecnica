from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, OportunidadViewSet

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'oportunidades', OportunidadViewSet, basename='oportunidad')

urlpatterns = [
    path('', include(router.urls)),
]