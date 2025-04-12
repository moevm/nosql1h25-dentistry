from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import CustomUser
from users.serializers import CustomUserSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.filter(role_id=2)  # роль "пациент"
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['me', 'my_dentist']:
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
    def my_dentist(self, request):
        dentist = request.user.assigned_dentist
        serializer = CustomUserSerializer(dentist)
        return Response(serializer.data)