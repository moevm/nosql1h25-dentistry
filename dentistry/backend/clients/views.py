from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from ..users.models import CustomUser, ClientRole, DentistRole
from ..users.serializers import CustomUserSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(role_id=ClientRole.id)
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['me', 'dentists']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'])
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        else:
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def dentists(self, request):
        dentists = CustomUser.objects.filter(role_id=DentistRole.id)
        serializer = CustomUserSerializer(dentists, many=True)
        return Response(serializer.data)