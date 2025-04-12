from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsDentist
from ..users.models import CustomUser, DentistRole
from ..users.serializers import CustomUserSerializer


class DentistViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(role_id=DentistRole.id)
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(
        detail=False,
        methods=['GET', 'PUT', 'PATCH'],
        permission_classes=[IsDentist]  # Только для врачей
    )
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

    @action(
        detail=False,
        methods=['GET'],
        permission_classes=[IsDentist]
    )
    def patients(self, request):
        patients = CustomUser.objects.filter(assigned_dentist=request.user)
        serializer = CustomUserSerializer(patients, many=True)
        return Response(serializer.data)