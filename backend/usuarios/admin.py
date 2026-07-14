from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


# se registra el modelo Usuario en el panel de administración
@admin.register(Usuario)
#se personaliza la interfaz de administración del modelo Usuario
class UsuarioAdmin(UserAdmin):
    
    fieldsets = UserAdmin.fieldsets + (
        ("Rol", {"fields": ("rol",)}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Rol", {"fields": ("rol",)}),
    )