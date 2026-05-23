from django.db import models
from django.conf import settings
from stories.models import Story


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} → {self.story.title}'
