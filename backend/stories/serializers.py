from rest_framework import serializers
from .models import Genre, Story, Chapter
from users.serializers import UserProfileSerializer


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'slug', 'description')


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('id', 'title', 'content', 'order', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class ChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('id', 'title', 'order', 'created_at')


class StoryListSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    genres = GenreSerializer(many=True, read_only=True)
    cover = serializers.SerializerMethodField()
    chapters_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = (
            'id', 'title', 'description', 'cover', 'author',
            'genres', 'status', 'is_featured', 'views_count',
            'chapters_count', 'favorites_count', 'comments_count', 'created_at',
        )

    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'username': obj.author.username,
            'first_name': obj.author.first_name,
        }

    def get_cover(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_url or None

    def get_chapters_count(self, obj):
        return obj.chapters.count()

    def get_favorites_count(self, obj):
        return obj.favorited_by.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


class StoryDetailSerializer(serializers.ModelSerializer):
    author = UserProfileSerializer(read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(), many=True, write_only=True, source='genres'
    )
    chapters = ChapterListSerializer(many=True, read_only=True)
    cover = serializers.SerializerMethodField()
    chapters_count = serializers.SerializerMethodField()
    favorites_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = (
            'id', 'title', 'description', 'cover', 'cover_url', 'cover_image',
            'author', 'genres', 'genre_ids', 'status', 'is_featured',
            'views_count', 'chapters', 'chapters_count',
            'favorites_count', 'comments_count', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'author', 'views_count', 'created_at', 'updated_at')

    def get_cover(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_url or None

    def get_chapters_count(self, obj):
        return obj.chapters.count()

    def get_favorites_count(self, obj):
        return obj.favorited_by.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def create(self, validated_data):
        genres = validated_data.pop('genres', [])
        story = Story.objects.create(**validated_data)
        story.genres.set(genres)
        return story

    def update(self, instance, validated_data):
        genres = validated_data.pop('genres', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if genres is not None:
            instance.genres.set(genres)
        return instance
