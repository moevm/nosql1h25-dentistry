from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecordViewSet

router = DefaultRouter()
router.register(r'', RecordViewSet, basename='record')

urlpatterns = [
    path('', include(router.urls)),
]