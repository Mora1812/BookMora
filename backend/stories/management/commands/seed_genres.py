from django.core.management.base import BaseCommand

from stories.models import Genre

# Géneros base de BookMora (nombre visible, slug para URLs amigables)
GENRES = [
    ('Aventura', 'aventura'),
    ('Ciencia Ficción', 'ciencia-ficcion'),
    ('Clásicos', 'clasicos'),
    ('Comedia', 'comedia'),
    ('Drama', 'drama'),
    ('Fantasía', 'fantasia'),
    ('Histórico', 'historico'),
    ('Juvenil', 'juvenil'),
    ('Misterio', 'misterio'),
    ('Poesía', 'poesia'),
    ('Romance', 'romance'),
    ('Terror', 'terror'),
    ('Thriller', 'thriller'),
]


class Command(BaseCommand):
    help = (
        'Crea los géneros/categorías base de BookMora si todavía no existen. '
        'Es seguro ejecutarlo varias veces: no duplica nada (usa get_or_create).'
    )

    def handle(self, *args, **options):
        creados = 0
        for name, slug in GENRES:
            _, was_created = Genre.objects.get_or_create(name=name, defaults={'slug': slug})
            if was_created:
                creados += 1

        self.stdout.write(self.style.SUCCESS(
            f'Listo. Géneros nuevos creados: {creados}. Total en la base de datos: {Genre.objects.count()}'
        ))
