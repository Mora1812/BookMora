from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GenreViewSet, StoryViewSet, ChapterViewSet

router = DefaultRouter()
router.register(r'genres', GenreViewSet, basename='genres')
router.register(r'', StoryViewSet, basename='stories')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:story_pk>/chapters/', ChapterViewSet.as_view({'get': 'list', 'post': 'create'}), name='story-chapters'),
    path('<int:story_pk>/chapters/<int:pk>/', ChapterViewSet.as_view({
        'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'
    }), name='story-chapter-detail'),
]
