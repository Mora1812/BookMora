# Modelo de usuario personalizado — extiende el usuario base de Django
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('reader', 'Lector'),          # Solo lee y comenta
        ('author', 'Autor'),           # Puede publicar historias
        ('admin',  'Administrador'),   # Acceso total al panel
    ]

    role         = models.CharField(max_length=10, choices=ROLE_CHOICES, default='reader')
    bio          = models.TextField(blank=True, default='')                   # Biografía del perfil
    avatar       = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Foto de perfil
    is_suspended = models.BooleanField(default=False)   # Cuenta bloqueada por admin
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.username} ({self.role})'

    @property
    def is_admin_role(self):
        return self.role == 'admin'
