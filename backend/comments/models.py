# Modelo de comentarios — cada usuario puede comentar en una historia
from django.db import models
from django.conf import settings
from stories.models import Story


class Comment(models.Model):
    story      = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments')          # Historia comentada
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')  # Quien comenta
    content    = models.TextField(max_length=1000)   # Texto del comentario (máx. 1000 chars)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']  # Más recientes primero

    def __str__(self):
        return f'{self.user.username} en "{self.story.title}"'
