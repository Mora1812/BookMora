from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    UserAdminSerializer,
)
from .permissions import IsAdminRole


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user, context={'request': request}).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AuthorDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.filter(is_active=True)
    serializer_class = UserProfileSerializer
    lookup_field = 'username'


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminRole]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'is_suspended', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'username']

    @action(detail=True, methods=['post'])
    def toggle_suspend(self, request, pk=None):
        user = self.get_object()
        user.is_suspended = not user.is_suspended
        user.save()
        state = 'suspendido' if user.is_suspended else 'activado'
        return Response({'detail': f'Usuario {state} correctamente.'})

    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        user = self.get_object()
        role = request.data.get('role')
        valid_roles = ['reader', 'author', 'admin']
        if role not in valid_roles:
            return Response({'detail': 'Rol inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save()
        return Response({'detail': f'Rol cambiado a {role}.'})

    def get_queryset(self):
        return CustomUser.objects.all().order_by('-date_joined')
