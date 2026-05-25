from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ['story']  # Filtra por historia: ?story=40

    def get_queryset(self):
        qs       = Comment.objects.select_related('user', 'story')
        story_id = self.request.query_params.get('story')
        if story_id:
            qs = qs.filter(story_id=story_id)
        return qs

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        comment = self.get_object()
        if request.user != comment.user and request.user.role != 'admin':
            return Response({'detail': 'Solo puedes editar tus propios comentarios.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if request.user != comment.user and request.user.role != 'admin':
            return Response({'detail': 'Solo puedes eliminar tus propios comentarios.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
