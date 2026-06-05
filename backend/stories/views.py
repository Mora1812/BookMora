from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from .models import Genre, Story, Chapter
from .serializers import GenreSerializer, StoryListSerializer, StoryDetailSerializer, ChapterSerializer
from users.permissions import IsAdminRole


class GenreViewSet(viewsets.ModelViewSet):
    queryset         = Genre.objects.all()
    serializer_class = GenreSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]  # Solo admin puede modificar géneros
        return [AllowAny()]


class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.select_related('author').prefetch_related('genres', 'chapters')

    # Permite filtrar por ?status=published, buscar por texto y ordenar resultados
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured', 'genres__slug']
    search_fields    = ['title', 'description', 'author__username']
    ordering_fields  = ['created_at', 'views_count', 'title']

    def get_serializer_class(self):
        return StoryListSerializer if self.action == 'list' else StoryDetailSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        qs   = Story.objects.select_related('author').prefetch_related('genres', 'chapters')
        user = self.request.user
        if self.action == 'list':
            if user.is_authenticated and user.role == 'admin':
                return qs
            if user.is_authenticated:
                return qs.filter(Q(status='published') | Q(author=user))
            return qs.filter(status='published')  # Anónimos solo ven publicadas
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'reader':  # Al publicar, el lector asciende a autor
            user.role = 'author'
            user.save()
        serializer.save(author=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'published':
            Story.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
            instance.refresh_from_db()
        return Response(self.get_serializer(instance).data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role != 'admin' and instance.author != request.user:
            return Response({'detail': 'No tienes permiso.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role != 'admin' and instance.author != request.user:
            return Response({'detail': 'No tienes permiso.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_stories(self, request):
        """Devuelve solo las historias del usuario logueado."""
        stories = Story.objects.filter(author=request.user).order_by('-created_at')
        return Response(StoryListSerializer(stories, many=True, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRole])
    def toggle_featured(self, request, pk=None):
        story = self.get_object()
        story.is_featured = not story.is_featured
        story.save()
        return Response({'detail': f'Historia {"destacada" if story.is_featured else "sin destacar"}.'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRole])
    def change_status(self, request, pk=None):
        story      = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['draft', 'published', 'suspended']:
            return Response({'detail': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        story.status = new_status
        story.save()
        return Response({'detail': f'Estado cambiado a {new_status}.'})


class ChapterViewSet(viewsets.ModelViewSet):
    serializer_class = ChapterSerializer

    def get_queryset(self):
        return Chapter.objects.filter(story_id=self.kwargs['story_pk']).order_by('order')

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        story = Story.objects.get(pk=self.kwargs['story_pk'])
        if self.request.user != story.author and self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Solo el autor puede agregar capítulos.')
        serializer.save(story=story, order=story.chapters.count() + 1)  # Orden automático

    def perform_update(self, serializer):
        chapter = self.get_object()
        if self.request.user != chapter.story.author and self.request.user.role != 'admin':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Solo el autor puede editar capítulos.')
        serializer.save()
