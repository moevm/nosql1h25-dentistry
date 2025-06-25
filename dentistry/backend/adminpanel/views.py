import csv
import io
from datetime import datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.http import HttpResponse
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from ..users.models import AdminRole, ClientRole, DentistRole, CustomUser
from ..users.permissions import CanManageUsers
from ..users.serializers import CustomUserSerializer

User = CustomUser


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления пользователями в админ-панели.
    """
    queryset = User.objects.all().order_by('-dt_add')
    serializer_class = 'backend.users.serializers.CustomUserSerializer' # Будет заменено в get_serializer_class
    permission_classes = [permissions.IsAdminUser]

    def get_serializer_class(self):
        # Позволяет djoser и другим частям системы использовать свои сериализаторы
        if self.action == 'list' or self.action == 'retrieve':
             # Импортируем здесь, чтобы избежать циклических зависимостей
            from ..users.serializers import CustomUserSerializer
            return CustomUserSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """Получение списка всех пользователей с фильтрацией."""
        all_users = list(User.objects.all().order_by('-dt_add'))
        
        # Фильтры
        role_filter = request.query_params.get('role')
        if role_filter:
            role_id_map = {'admin': 1, 'patient': 2, 'specialist': 3}
            role_id = role_id_map.get(role_filter)
            if role_id:
                all_users = [user for user in all_users if user.role_id == role_id]
        
        is_active_filter = request.query_params.get('is_active')
        if is_active_filter is not None:
            is_active = is_active_filter.lower() == 'true'
            all_users = [user for user in all_users if user.is_active == is_active]
        
        search = request.query_params.get('search')
        if search:
            all_users = [
                user for user in all_users if
                search.lower() in user.first_name.lower() or
                search.lower() in user.last_name.lower() or
                search.lower() in user.email.lower() or
                search.lower() in user.username.lower()
            ]

        # Пагинация
        page = self.paginate_queryset(all_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(all_users, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Удаление пользователя администратором."""
        user_to_delete = self.get_object()
        
        if user_to_delete.id == request.user.id:
            return Response({"error": "Нельзя удалить самого себя"}, status=status.HTTP_400_BAD_REQUEST)
        
        if user_to_delete.role_id == AdminRole.id:
            return Response({"error": "Нельзя удалить другого администратора"}, status=status.HTTP_403_FORBIDDEN)
        
        # Soft delete, если есть связанные записи.
        from ..records.models import Record
        if Record.objects.filter(models.Q(patient=user_to_delete) | models.Q(dentist=user_to_delete)).exists():
            user_to_delete.is_active = False
            user_to_delete.save()
            return Response({"message": "Пользователь деактивирован, так как у него есть связанные записи."}, status=status.HTTP_200_OK)

        user_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['PATCH'], detail=True, url_path='toggle')
    def toggle_active(self, request, pk=None):
        """Активация/деактивация пользователя."""
        user = self.get_object()
        if user.id == request.user.id:
            return Response({"error": "Нельзя изменить свой статус активности."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_active = not user.is_active
        user.save()
        status_text = "активирован" if user.is_active else "деактивирован"
        return Response({
            "message": f"Пользователь {user.username} {status_text}",
            "is_active": user.is_active
        })


class AdminViewSet(viewsets.ViewSet):
    """
    ViewSet для дашборда и экспорта.
    """
    permission_classes = [permissions.IsAdminUser]

    @action(methods=['GET'], detail=False, url_path='dashboard')
    def dashboard(self, request):
        """Получение статистики для админ панели."""
        try:
            from ..records.models import Record
            
            # Общая статистика
            all_users = list(User.objects.all())
            total_users = len(all_users)
            active_users = len([user for user in all_users if user.is_active])
            inactive_users = total_users - active_users
            
            # Статистика по ролям
            admins_count = len([user for user in all_users if user.role_id == AdminRole.id])
            patients_count = len([user for user in all_users if user.role_id == ClientRole.id])
            specialists_count = len([user for user in all_users if user.role_id == DentistRole.id])
            
            # Статистика записей
            all_records = list(Record.objects.all())
            total_records = len(all_records)
            scheduled_records = len([r for r in all_records if r.status == 'scheduled'])
            completed_records = len([r for r in all_records if r.status == 'completed'])
            canceled_records = len([r for r in all_records if r.status == 'canceled'])
            
            dashboard_data = {
                'users': {
                    'total': total_users,
                    'active': active_users,
                    'inactive': inactive_users,
                    'new_last_30_days': 0 # new_users_30d
                },
                'users_by_role': {
                    'admins': admins_count,
                    'patients': patients_count,
                    'specialists': specialists_count
                },
                'records': {
                    'total': total_records,
                    'scheduled': scheduled_records,
                    'completed': completed_records,
                    'canceled': canceled_records
                }
            }
            
            return Response(dashboard_data)
            
        except Exception as e:
            # Важно логировать ошибку
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Ошибка в /api/admin/dashboard/: {e}", exc_info=True)

            return Response(
                {"error": f"Ошибка при получении статистики: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(methods=['GET'], detail=False, url_path='export/users')
    def export_users(self, request):
        """Экспорт пользователей в CSV."""
        try:
            output = io.StringIO()
            writer = csv.writer(output)
            
            headers = [
                'ID', 'Имя пользователя', 'Email', 'Имя', 'Фамилия', 'Отчество',
                'Роль', 'Телефон', 'Дата рождения', 'Пол', 'Активен', 'Дата создания'
            ]
            writer.writerow(headers)
            
            users = User.objects.all().order_by('id')
            role_names = {1: 'Администратор', 2: 'Пациент', 3: 'Специалист'}
            
            for user in users:
                row = [
                    user.id, user.username, user.email, user.first_name, user.last_name,
                    user.second_name or '', role_names.get(user.role_id, 'Неизвестно'),
                    user.phone or '', user.birth_date.strftime('%Y-%m-%d') if user.birth_date else '',
                    user.get_gender_display() if user.gender else '',
                    'Да' if user.is_active else 'Нет',
                    user.dt_add.strftime('%Y-%m-%d %H:%M:%S') if user.dt_add else ''
                ]
                writer.writerow(row)
            
            output.seek(0)
            response = HttpResponse(output.getvalue(), content_type='text/csv; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="users_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
            return response
        except Exception as e:
            # Логирование
            return Response({"error": "Ошибка при экспорте пользователей"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['GET'], detail=False, url_path='export/records')
    def export_records(self, request):
        """Экспорт записей в CSV."""
        try:
            from ..records.models import Record
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            headers = [
                'ID записи', 'Пациент', 'Email пациента', 'Специалист', 'Email специалиста',
                'Дата приема', 'Длительность (мин)', 'Статус', 'Заметки',
                'Дата создания'
            ]
            writer.writerow(headers)
            
            records = Record.objects.select_related('patient', 'dentist').all()
            status_names = {'scheduled': 'Запланирован', 'completed': 'Завершен', 'canceled': 'Отменен'}
            
            for record in records:
                row = [
                    record.id,
                    f"{record.patient.first_name} {record.patient.last_name}",
                    record.patient.email,
                    f"{record.dentist.first_name} {record.dentist.last_name}",
                    record.dentist.email,
                    record.appointment_date.strftime('%Y-%m-%d %H:%M'),
                    f"{record.duration} мин",
                    status_names.get(record.status, record.status),
                    record.notes or '',
                    record.created_at.strftime('%Y-%m-%d %H:%M:%S')
                ]
                writer.writerow(row)

            output.seek(0)
            response = HttpResponse(output.getvalue(), content_type='text/csv; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="records_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv"'
            return response
            
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Ошибка при экспорте записей: {e}", exc_info=True)
            return Response(
                {"error": f"Ошибка при экспорте записей: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 