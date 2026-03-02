from django.db import models


class Cliente(models.Model):
    nombre_completo = models.CharField(max_length=200)
    empresa = models.CharField(max_length=200)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_registro']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.nombre_completo} – {self.empresa}"


class Oportunidad(models.Model):
    ESTADOS = [
        ('Nuevo', 'Nuevo'),
        ('Contactado', 'Contactado'),
        ('En negociación', 'En negociación'),
        ('En seguimiento', 'En seguimiento'),
        ('Cerrado', 'Cerrado'),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.CASCADE,
        related_name='oportunidades'
    )
    descripcion = models.TextField()
    valor_estimado = models.DecimalField(max_digits=15, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Nuevo')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = 'Oportunidad'
        verbose_name_plural = 'Oportunidades'

    def __str__(self):
        return f"{self.cliente.nombre_completo} – {self.descripcion[:50]}"