from rest_framework import serializers
from .models import Favorite
from stories.serializers import StoryListSerializer


class FavoriteSerializer(serializers.ModelSerializer):
    story_detail = StoryListSerializer(source='story', read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'story', 'story_detail', 'created_at')
        read_only_fields = ('id', 'created_at')
