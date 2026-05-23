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

## Estructura del proyecto

```
BookMora_Servidores/
├── docker-compose.yml
├── .env                    # Variables de entorno (no subir a git)
├── .env.example            # Plantilla de variables
├── nginx/
│   └── nginx.conf
├── backend/                # Django 5
│   ├── bookmora/           # Configuración principal
│   ├── users/              # Autenticación y perfiles
│   ├── stories/            # Historias, capítulos y géneros
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
```
