from django.db import models
from django.conf import settings


class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Story(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
        ('suspended', 'Suspendido'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)
    cover_url = models.URLField(blank=True, default='')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='stories',
    )
    genres = models.ManyToManyField(Genre, blank=True, related_name='stories')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} - {self.author.username}'

    @property
    def chapters_count(self):
        return self.chapters.count()

    @property
    def favorites_count(self):
        return self.favorited_by.count()

    @property
    def comments_count(self):
        return self.comments.count()


class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']
        unique_together = ('story', 'order')

    def __str__(self):
        return f'Cap. {self.order}: {self.title} ({self.story.title})'
