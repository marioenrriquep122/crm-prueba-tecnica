from django.contrib import admin
from .models import Cliente, Oportunidad


class OportunidadInline(admin.TabularInline):
    model = Oportunidad
    extra = 1


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'empresa', 'correo_electronico', 'ciudad', 'fecha_registro']
    search_fields = ['nombre_completo', 'empresa', 'correo_electronico']
    list_filter = ['ciudad']
    inlines = [OportunidadInline]


@admin.register(Oportunidad)
class OportunidadAdmin(admin.ModelAdmin):
    list_display = ['cliente', 'descripcion', 'valor_estimado', 'estado', 'fecha_creacion']
    list_filter = ['estado']
    search_fields = ['cliente__nombre_completo', 'descripcion']