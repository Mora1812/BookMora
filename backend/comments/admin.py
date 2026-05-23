from django.contrib import admin
from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'story', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'story__title', 'content')
    ordering = ('-created_at',)
