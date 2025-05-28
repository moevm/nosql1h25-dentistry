from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DentistViewSet

router = DefaultRouter()
router.register(r'', DentistViewSet, basename='dentist')

urlpatterns = [
    path('me/', DentistViewSet.as_view({'get': 'me', 'put': 'me', 'patch': 'me'}), name='me'),
    path('me/patients/', DentistViewSet.as_view({'get': 'patients'}), name='patients'),
] + router.urls