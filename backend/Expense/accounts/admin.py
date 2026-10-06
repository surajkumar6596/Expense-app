from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    model = User

    # Admin Panel List View Columns
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'gender', 'is_staff')
    
    # Search & Filter Fields
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'gender')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    ordering = ('username',)

    # User Details View (Form Sections)
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Info', {'fields': ('phone', 'gender')}),
    )

    # User Add/Create Form in Admin Panel
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Info', {'fields': ('phone', 'gender')}),
    )


# Custom User Model Registration
admin.site.register(User, CustomUserAdmin)