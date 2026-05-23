from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    LogoutView,
    MeView,
    AuthorDetailView,
    AdminUserViewSet,
)

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('authors/<str:username>/', AuthorDetailView.as_view(), name='author-detail'),
    path('', include(router.urls)),
]
