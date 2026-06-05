from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import CustomUser
from .serializers import CustomTokenObtainPairSerializer, RegisterSerializer, UserProfileSerializer, UserAdminSerializer
from .permissions import IsAdminRole


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer  # Incluye role y username en el token


class RegisterView(generics.CreateAPIView):
    """Crea el usuario y devuelve tokens JWT en la misma respuesta."""
    queryset           = CustomUser.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user    = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserProfileSerializer(user, context={'request': request}).data,
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()  # Invalida el refresh token para que no pueda renovarse
            return Response({'detail': 'Sesión cerrada correctamente.'})
        except Exception:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveUpdateAPIView):
    """Devuelve o actualiza el perfil del usuario logueado."""
    serializer_class   = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AuthorDetailView(generics.RetrieveAPIView):
    queryset         = CustomUser.objects.filter(is_active=True)
    serializer_class = UserProfileSerializer
    lookup_field     = 'username'


class AdminUserViewSet(viewsets.ModelViewSet):
    """CRUD de usuarios — solo accesible por administradores."""
    queryset           = CustomUser.objects.all()
    serializer_class   = UserAdminSerializer
    permission_classes = [IsAdminRole]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields   = ['role', 'is_suspended', 'is_active']
    search_fields      = ['username', 'email', 'first_name', 'last_name']
    ordering_fields    = ['date_joined', 'username']

    def get_queryset(self):
        return CustomUser.objects.all().order_by('-date_joined')

    @action(detail=True, methods=['post'])
    def toggle_suspend(self, request, pk=None):
        user              = self.get_object()
        user.is_suspended = not user.is_suspended
        user.save()
        return Response({'detail': f'Usuario {"suspendido" if user.is_suspended else "activado"}.'})

    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        user = self.get_object()
        role = request.data.get('role')
        if role not in ['reader', 'author', 'admin']:
            return Response({'detail': 'Rol inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save()
        return Response({'detail': f'Rol cambiado a {role}.'})
