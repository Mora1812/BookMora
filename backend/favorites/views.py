from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class   = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('story', 'story__author')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Toggle: si ya existe lo elimina; si no, lo agrega."""
        story_id = request.data.get('story')
        existing = Favorite.objects.filter(user=request.user, story_id=story_id).first()
        if existing:
            existing.delete()
            return Response({'detail': 'Historia removida de favoritos.', 'is_favorite': False})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'detail': 'Historia agregada a favoritos.', 'is_favorite': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def check(self, request):
        """Verifica si una historia está en favoritos: ?story=40"""
        is_fav = Favorite.objects.filter(user=request.user, story_id=request.query_params.get('story')).exists()
        return Response({'is_favorite': is_fav})
