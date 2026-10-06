

# # Register your models here.
# from django.contrib import admin
# from .models import Transaction, User  # Ya aapke profile models

# @admin.register(Transaction)
# class TransactionAdmin(admin.ModelAdmin):
#     # Table columns display
#     list_display = ('id', 'user', 'title', 'amount', 'type', 'category', 'created_at')
    
#     # Filtering options on the right sidebar
#     list_filter = ('type', 'category', 'created_at')
    
#     # Search bar fields
#     search_fields = ('title', 'user__username', 'user__email')
    
#     # Pagination
#     list_per_page = 25
    
#     # Default ordering
#     ordering = ('-created_at',)
    
#     # Read-only fields
#     readonly_fields = ('created_at',)

# # Profile model registration (if created)
# @admin.register(UserProfile)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'phone_number', 'profile_picture')
#     search_fields = ('user__username', 'user__email')