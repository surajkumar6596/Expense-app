from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet,AdminDashboardViewSet

router = DefaultRouter()
router.register(r'transaction', TransactionViewSet, basename='transaction')
router.register(r'admin-dashboard', AdminDashboardViewSet, basename='admin-dashboard')

urlpatterns=[
    path('', include(router.urls))
]