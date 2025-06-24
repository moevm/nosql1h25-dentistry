from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Record
from .serializers import RecordSerializer
from .filters import RecordFilter
from ..users.paginations import PageLimitPagination

class IsDentistOrAdminOrPatientReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role_id == 3 or request.user.is_staff  # Стоматолог или админ

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.patient == request.user or obj.dentist == request.user or request.user.is_staff
        return obj.dentist == request.user or request.user.is_staff  # Только стоматолог записи или админ

class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RecordFilter
    permission_classes = [permissions.AllowAny]
    pagination_class = PageLimitPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or not user.is_authenticated:  # Админ видит все записи
            return Record.objects.all().order_by('-appointment_date')
        elif user.role_id == 3:  # Стоматолог видит свои записи
            return Record.objects.filter(dentist=user).order_by('-appointment_date')
        elif user.role_id == 2:  # Пациент видит только свои записи
            return Record.objects.filter(patient=user).order_by('-appointment_date')
        return Record.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role_id == 3:  # Если стоматолог
            serializer.save(dentist=self.request.user)
        elif self.request.user.role_id == 2:  # Если клиент
            serializer.save(patient=self.request.user)
        elif self.request.user.is_staff:  # Если админ
            # Админ может создать запись для любого стоматолога
            if 'dentist' not in serializer.validated_data:
                raise PermissionDenied("Admin must specify dentist when creating record")
            serializer.save()

    # def perform_update(self, serializer):
    #     if self.request.user.role_id == 3 or self.request.user.is_staff:
    #         serializer.save()
    #     else:
    #         raise PermissionDenied("Only dentists and admins can update records")

    # def perform_destroy(self, instance):
    #     if self.request.user.role_id == 3 or self.request.user.is_staff:
    #         instance.delete()
    #     else:
    #         raise PermissionDenied("Only dentists and admins can delete records")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context