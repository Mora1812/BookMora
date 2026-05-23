from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_suspended', 'is_active', 'date_joined')
    list_filter = ('role', 'is_suspended', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = UserAdmin.fieldsets + (
        ('BookMora', {'fields': ('role', 'bio', 'avatar', 'is_suspended')}),
    )
