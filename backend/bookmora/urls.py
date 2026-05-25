# Rutas principales del proyecto — conecta cada app con su prefijo de URL
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/',              admin.site.urls),                        # Panel admin de Django
    path('api/auth/',           include('users.urls')),                  # Login, registro, perfil
    path('api/stories/',        include('stories.urls')),                # Historias, géneros, capítulos
    path('api/comments/',       include('comments.urls')),               # Comentarios
    path('api/favorites/',      include('favorites.urls')),              # Biblioteca / favoritos
    path('api/token/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),  # Renueva access token
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)      # Sirve archivos subidos (portadas, avatares)
