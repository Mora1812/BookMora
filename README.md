# BookMora — Plataforma de Lectura y Storytelling Digital

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Django 5 + Django REST Framework + JWT |
| Frontend | React 18 + Vite + React Router v6 + Axios |
| Base de datos | PostgreSQL 15 |
| Proxy | Nginx |
| Orquestación | Docker Compose |

---

## Requisitos

- Docker Desktop instalado y corriendo
- Git

---

## Cómo levantar el proyecto

### 1. Clonar / tener la carpeta lista

```bash
cd BookMora_Servidores
```

### 2. Levantar todos los servicios

```bash
docker-compose up --build
```

La primera vez tarda unos minutos mientras descarga imágenes e instala dependencias.

### 3. Acceder

| Servicio | URL |
|---------|-----|
| Plataforma web | http://localhost |
| API REST | http://localhost/api |
| Django Admin | http://localhost/admin |

### 4. Crear superusuario administrador

En otra terminal, con los contenedores corriendo:

```bash
docker exec -it bookmora_backend python manage.py createsuperuser
```

Después en la plataforma, ve al panel `/admin` e inicia sesión con esas credenciales.

---

## Datos de muestra (seed)

Para poblar la plataforma con un catálogo de demostración (historias, capítulos, géneros, autores y portadas — el mismo que se ve en `https://moramj.online/catalog`), ejecuta estos comandos con los contenedores corriendo:

```bash
# 1. Crea los géneros base (incluye Aventura, Fantasía, Thriller, etc.)
docker exec -it bookmora_backend python manage.py seed_genres

# 2. Crea 3 autores demo + 19 historias de muestra con portadas, capítulos y géneros
docker exec -it bookmora_backend python manage.py seed_demo_catalog
```

Ambos comandos son **idempotentes**: se pueden ejecutar varias veces sin duplicar nada (los géneros se identifican por nombre y las historias por título — si ya existen, simplemente se omiten).

`seed_demo_catalog` crea estas cuentas de autor demo si todavía no existen (contraseña: `bookmora2024`):

| Usuario | Bio |
|---------|-----|
| `bookmora_demo` | — |
| `morita` | Vivan las Moras |
| `dag12` | — |

> Las portadas y el JSON de las historias viajan empaquetados dentro de `backend/stories/management/commands/seed_data/`, así que el comando funciona igual en local que en cualquier servidor donde se despliegue la imagen del backend.

---

## Estructura del proyecto

```
BookMora_Servidores/
├── docker-compose.yml
├── docker-compose.prod.yml # Orquestación para producción (VPS, imágenes desde Docker Hub)
├── deploy.sh               # Script de referencia para desplegar en el VPS
├── .env                    # Variables de entorno de desarrollo (no subir a git)
├── .env.prod               # Variables de entorno de producción (no subir a git)
├── .env.example            # Plantilla de variables
├── nginx/
│   ├── nginx.conf          # Proxy reverso para desarrollo local
│   └── nginx.prod.conf     # Proxy reverso para producción (sirve /static/ y /media/)
├── backend/                # Django 5
│   ├── bookmora/           # Configuración principal
│   ├── users/              # Autenticación y perfiles
│   ├── stories/            # Historias, capítulos, géneros y comandos de seed
│   │   └── management/commands/   # seed_genres, seed_demo_catalog (+ datos empaquetados)
│   ├── comments/           # Sistema de comentarios
│   └── favorites/          # Biblioteca personal
└── frontend/               # React 18 + Vite
    └── src/
        ├── api/            # Capa de peticiones Axios
        ├── context/        # AuthContext
        ├── components/     # Navbar, Footer, StoryCard, etc.
        ├── pages/          # Todas las páginas
        │   └── admin/      # Panel administrativo
        └── styles/         # Variables CSS del sistema de diseño
```

---

## API Endpoints principales

### Autenticación
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| POST | `/api/auth/register/` | Registro de usuario |
| POST | `/api/auth/login/` | Login → devuelve JWT |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| GET/PATCH | `/api/auth/me/` | Perfil del usuario actual |

### Historias
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | `/api/stories/` | Catálogo con filtros y búsqueda |
| POST | `/api/stories/` | Crear historia |
| GET | `/api/stories/{id}/` | Detalle de historia |
| PATCH | `/api/stories/{id}/` | Editar historia |
| DELETE | `/api/stories/{id}/` | Eliminar historia |
| GET | `/api/stories/my_stories/` | Mis historias |
| GET | `/api/stories/{id}/chapters/` | Capítulos de una historia |
| GET/POST | `/api/stories/genres/` | Géneros |

### Comentarios y Favoritos
| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | `/api/comments/?story={id}` | Comentarios de una historia |
| POST | `/api/comments/` | Publicar comentario |
| POST | `/api/favorites/` | Agregar/quitar favorito (toggle) |
| GET | `/api/favorites/` | Mi biblioteca |

---

## Variables de entorno (.env)

```env
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=bookmora_db
DB_USER=bookmora_user
DB_PASSWORD=tu-password-seguro

CORS_ALLOWED_ORIGINS=http://localhost,http://localhost:80

VITE_API_URL=http://localhost/api
```

---

## Roles de usuario

| Rol | Permisos |
|-----|---------|
| `reader` | Leer, comentar, guardar favoritos |
| `author` | Todo lo anterior + publicar y editar sus historias |
| `admin` | Control total: usuarios, historias, géneros, panel admin |

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del backend
docker-compose logs -f backend

# Ejecutar migraciones manualmente
docker exec -it bookmora_backend python manage.py migrate

# Abrir shell de Django
docker exec -it bookmora_backend python manage.py shell

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la base de datos)
docker-compose down -v

# Poblar el catálogo de muestra (ver sección "Datos de muestra")
docker exec -it bookmora_backend python manage.py seed_genres
docker exec -it bookmora_backend python manage.py seed_demo_catalog
```

---

## Despliegue en producción

BookMora está desplegado en una VPS y disponible en **https://moramj.online** 🚀

| Servicio | URL |
|---------|-----|
| Plataforma web | https://moramj.online |
| API REST | https://moramj.online/api |
| Django Admin | https://moramj.online/admin |

El entorno de producción usa una configuración independiente del de desarrollo:

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.prod.yml` | Orquesta los contenedores usando las imágenes ya construidas y publicadas en Docker Hub (`mora1812/bookmora-backend`, `mora1812/bookmora-frontend`), con volúmenes para `static_files` y `media_files` |
| `nginx/nginx.prod.conf` | Proxy reverso: enruta `/`, `/api/`, `/admin/`, `/static/` y `/media/`; sirve detrás de Cloudflare (HTTPS) |
| `.env.prod` | Variables de entorno de producción (secretos — no se sube al repo) |

**Flujo de despliegue (resumen):**
1. Construir y subir las imágenes actualizadas a Docker Hub: `docker build` + `docker push` para `backend` y `frontend`
2. En el servidor: `docker-compose pull` y luego `docker-compose up -d --force-recreate`
3. Si hay migraciones o datos nuevos: `python manage.py migrate` y, si aplica, los comandos de seed (`seed_genres`, `seed_demo_catalog`)

> ⚠️ **VPS compartida:** el mismo servidor también aloja `soydaya.online` (proyecto de una compañera). El archivo `nginx.prod.conf` incluye el bloque `server` de ambos sitios — nunca se debe desplegar una versión que elimine el bloque de `soydaya.online`, o su sitio dejaría de responder.
