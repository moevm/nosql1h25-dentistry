from django.urls import include, path
from rest_framework import routers
from .views import CustomUserViewSet


router = routers.DefaultRouter()
router.register(r'', CustomUserViewSet)

app_name = 'users'

urlpatterns = [
    path('', include(router.urls)),
]
