from rest_framework import permissions
from ..users.models import CustomUser, ClientRole
from ..users.serializers import CustomUserSerializer
from ..users.views import CustomUserViewSet

class ClientViewSet(CustomUserViewSet):
    queryset = CustomUser.objects.filter(role_id=ClientRole.id)
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]
