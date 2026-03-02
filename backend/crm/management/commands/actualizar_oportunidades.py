from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from crm.models import Oportunidad


class Command(BaseCommand):
    help = 'Marca como "En seguimiento" las oportunidades en estado Nuevo por más de 7 días'

    def handle(self, *args, **options):
        hace_7_dias = timezone.now() - timedelta(days=7)

        oportunidades = Oportunidad.objects.filter(
            estado='Nuevo',
            fecha_creacion__lte=hace_7_dias
        )

        total = oportunidades.count()

        if total == 0:
            self.stdout.write(self.style.WARNING('No hay oportunidades para actualizar.'))
            return

        oportunidades.update(estado='En seguimiento')

        self.stdout.write(
            self.style.SUCCESS(
                f' {total} oportunidad(es) actualizadas a "En seguimiento"'
            )
        )