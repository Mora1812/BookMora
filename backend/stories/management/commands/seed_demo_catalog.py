import json
import os
import shutil

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from stories.models import Chapter, Genre, Story

User = get_user_model()

# Carpeta empaquetada junto al código (viaja dentro de la imagen del backend):
#   seed_data/covers/<archivo>.jpg     -> portadas locales de algunas historias
#   seed_data/demo_stories.json        -> historias, capítulos, géneros y autor de cada una
SEED_DIR = os.path.join(os.path.dirname(__file__), 'seed_data')
COVERS_DIR = os.path.join(SEED_DIR, 'covers')
STORIES_FILE = os.path.join(SEED_DIR, 'demo_stories.json')

# Autores demo: se crean solo si todavía no existen (idempotente).
# La contraseña se asigna únicamente a las cuentas nuevas; si ya existen, no se tocan.
DEMO_AUTHORS = {
    'bookmora_demo': {'email': 'demo@bookmora.com', 'role': 'author', 'bio': ''},
    'morita':        {'email': 'maria1@gmail.com',  'role': 'author', 'bio': 'Vivan las Moras'},
    'dag12':         {'email': 'dag@gmail.com',     'role': 'author', 'bio': ''},
}
DEMO_PASSWORD = 'bookmora2024'


class Command(BaseCommand):
    help = (
        'Recrea el catálogo de historias de muestra que existe en el entorno local '
        '(las mismas portadas, capítulos, géneros y autores demo). Crea los autores '
        'que falten, copia las portadas empaquetadas con la imagen a media/covers/ '
        'y crea cada historia con sus capítulos. Es seguro ejecutarlo varias veces: '
        'las historias se identifican por título y nunca se duplican.'
    )

    def handle(self, *args, **options):
        self._crear_autores_demo()
        self._copiar_portadas_locales()
        self._crear_historias()

    # 1. Autores demo --------------------------------------------------------
    def _crear_autores_demo(self):
        for username, info in DEMO_AUTHORS.items():
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': info['email'],
                    'role': info['role'],
                    'bio': info['bio'],
                },
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.save()
                self.stdout.write(self.style.SUCCESS(
                    f'Autor demo creado: "{username}" (contraseña: {DEMO_PASSWORD})'
                ))

    # 2. Portadas locales -----------------------------------------------------
    def _copiar_portadas_locales(self):
        if not os.path.isdir(COVERS_DIR):
            return

        destino_dir = os.path.join(settings.MEDIA_ROOT, 'covers')
        os.makedirs(destino_dir, exist_ok=True)

        copiadas = 0
        for nombre_archivo in os.listdir(COVERS_DIR):
            origen = os.path.join(COVERS_DIR, nombre_archivo)
            destino = os.path.join(destino_dir, nombre_archivo)
            if not os.path.exists(destino):
                shutil.copyfile(origen, destino)
                copiadas += 1

        if copiadas:
            self.stdout.write(self.style.SUCCESS(
                f'Portadas copiadas a media/covers/: {copiadas}'
            ))

    # 3. Historias, capítulos y géneros ---------------------------------------
    def _crear_historias(self):
        if not os.path.exists(STORIES_FILE):
            self.stdout.write(self.style.ERROR(f'No se encontró el archivo {STORIES_FILE}'))
            return

        with open(STORIES_FILE, encoding='utf-8') as f:
            historias = json.load(f)

        creadas = 0
        for data in historias:
            if Story.objects.filter(title=data['title']).exists():
                continue

            try:
                autor = User.objects.get(username=data['author'])
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(
                    f'Se omite "{data["title"]}": no existe el autor "{data["author"]}"'
                ))
                continue

            historia = Story.objects.create(
                title=data['title'],
                description=data['description'],
                cover_image=data['cover_image'],
                cover_url=data['cover_url'],
                author=autor,
                status=data['status'],
                is_featured=data['is_featured'],
            )

            for nombre_genero in data['genres']:
                genero, _ = Genre.objects.get_or_create(
                    name=nombre_genero,
                    defaults={'slug': slugify(nombre_genero)},
                )
                historia.genres.add(genero)

            for capitulo in data['chapters']:
                Chapter.objects.create(
                    story=historia,
                    title=capitulo['title'],
                    content=capitulo['content'],
                    order=capitulo['order'],
                )

            creadas += 1

        self.stdout.write(self.style.SUCCESS(
            f'Listo. Historias nuevas creadas: {creadas}. '
            f'Total en la base de datos: {Story.objects.count()}'
        ))
