# Serializer de comentarios
from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()  # Solo datos públicos del usuario (sin email)

    class Meta:
        model            = Comment
        fields           = ('id', 'story', 'user', 'content', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def get_user(self, obj):
        return {'id': obj.user.id, 'username': obj.user.username, 'first_name': obj.user.first_name}
