from django.urls import include, path
from rest_framework import routers
from .views import AdminViewSet, AdminUserViewSet

router = routers.DefaultRouter()
router.register(r'users', AdminUserViewSet, basename='admin-users')
router.register(r'', AdminViewSet, basename='adminpanel')

app_name = 'adminpanel'

urlpatterns = [
    path('', include(router.urls)),
] 