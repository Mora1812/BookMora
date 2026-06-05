# Rutas de autenticación y usuarios — prefijo: /api/auth/
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomTokenObtainPairView, RegisterView, LogoutView, MeView, AuthorDetailView, AdminUserViewSet

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')  # CRUD admin de usuarios

urlpatterns = [
    path('login/',                CustomTokenObtainPairView.as_view(), name='login'),     # Obtiene tokens JWT
    path('register/',             RegisterView.as_view(),               name='register'), # Crea cuenta
    path('logout/',               LogoutView.as_view(),                 name='logout'),   # Invalida token
    path('me/',                   MeView.as_view(),                     name='me'),       # Perfil propio
    path('authors/<str:username>/', AuthorDetailView.as_view(),         name='author-detail'),
    path('', include(router.urls)),
]
