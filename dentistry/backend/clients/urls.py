from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

router = DefaultRouter()
router.register(r'', ClientViewSet, basename='client')

urlpatterns = [
    path('me/', ClientViewSet.as_view({'get': 'me', 'put': 'me', 'patch': 'me'}), name='me'),
    path('dentists/', ClientViewSet.as_view({'get': 'dentists'}), name='dentists'),
] + router.urls