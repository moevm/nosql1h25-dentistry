from rest_framework import permissions
from ..users.models import CustomUser, DentistRole
from ..users.serializers import CustomUserSerializer
from ..users.views import CustomUserViewSet


class DentistViewSet(CustomUserViewSet):
    queryset = CustomUser.objects.filter(role_id=DentistRole.id)
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]