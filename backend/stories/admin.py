from django.contrib import admin
from .models import Genre, Story, Chapter


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 0
    fields = ('title', 'order', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'is_featured', 'views_count', 'created_at')
    list_filter = ('status', 'is_featured', 'genres')
    search_fields = ('title', 'author__username', 'description')
    list_editable = ('status', 'is_featured')
    filter_horizontal = ('genres',)
    inlines = [ChapterInline]
    ordering = ('-created_at',)


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title', 'story', 'order', 'created_at')
    list_filter = ('story',)
    search_fields = ('title', 'story__title')
    ordering = ('story', 'order')
