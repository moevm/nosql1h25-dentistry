import base64
import os
import csv
import io
from datetime import datetime

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db import models
from django.http import HttpResponse
from djoser.views import UserViewSet
from rest_framework import permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .paginations import PageLimitPagination

from .serializers import AvatarSerializer
from .models import get_role_by_id, AdminRole, ClientRole, DentistRole
from .permissions import IsAdminUser, CanManageUsers

User = get_user_model()


class CustomUserViewSet(UserViewSet):
    pagination_class = PageLimitPagination

    def get_permissions(self):
        return (permissions.AllowAny(), )

    @action(
        methods=['PUT', 'PATCH'],
        detail=False,
        permission_classes=[IsAuthenticated],
        url_path='me/avatar'
    )
    def avatar(self, request):
        user = request.user
        avatar_base64 = request.data.get('avatar')
        if avatar_base64:
            avatar_base64 = avatar_base64.split(",")[1]
            avatar_data = base64.b64decode(avatar_base64)
            avatar_file = ContentFile(avatar_data,
                                      name=f'avatar{user.id}.png')
            user.avatar.save(f'avatar{user.id}.png', avatar_file)
            user.save()
            return Response(
                AvatarSerializer(user, context={'request': request}).data
            )
        else:
            return Response({"errors": "Аватар не предоставлен"},
                            status=400)

    @avatar.mapping.delete
    def del_avatar(self, request):
        user = request.user
        if user.avatar:
            os.remove(user.avatar.path)
            user.avatar = None
            user.save()
            return Response(status=204)
        else:
            return Response({"errors": "У вас нет аватара"}, status=400)

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

    def validate_additional_info(self, additional_info, role_class):
        """Проверка и валидация полей additional_info для пользователя."""

        schema = role_class.schema
        allowed_fields = schema.get("fields", set())
        required_fields = schema.get("required_fields", set())


        # Если дополнительная информация передана
        if additional_info:
            info_keys = set(additional_info.keys())

            # Проверка на недопустимые поля
            extra_fields = info_keys - allowed_fields
            if extra_fields:
                return Response({
                    "additional_info": f"Недопустимые поля: {', '.join(extra_fields)}"
                }, status=400)

            # Проверка на отсутствие обязательных полей
            missing_fields = required_fields - info_keys
            if missing_fields:
                print(missing_fields)
                return Response({
                    "additional_info": f"Обязательные поля отсутствуют: {', '.join(missing_fields)}"
                }, status=400)

        return additional_info

    def perform_update(self, serializer):
        user = self.get_object()
        data = serializer.validated_data
        instance = self.get_object()
        # if not self.request.user.is_support and 'role_id' in data:
        #     return Response({"errors": "У вас нет прав"}, status=403)

        role_class = get_role_by_id(data.get('role_id'))

        additional_info = data.get('additional_info', {})
        validation_response = self.validate_additional_info(additional_info, role_class)
        if isinstance(validation_response, Response):
            raise serializers.ValidationError(validation_response.data)


        super().perform_update(serializer)

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[CanManageUsers],
        url_path='admin/export'
    )
    def export_users(self, request):
        """Экспорт всех пользователей в CSV формате."""
        try:
            # Создаем CSV файл в памяти
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Заголовки CSV
            headers = [
                'ID', 'Имя пользователя', 'Email', 'Имя', 'Фамилия', 'Отчество',
                'Роль', 'Телефон', 'Дата рождения', 'Пол', 'Активен', 
                'Дата создания', 'Дата обновления', 'Дополнительная информация'
            ]
            writer.writerow(headers)
            
            # Получаем всех пользователей
            users = User.objects.all().order_by('id')
            
            role_names = {
                1: 'Администратор',
                2: 'Пациент', 
                3: 'Специалист'
            }
            
            for user in users:
                row = [
                    user.id,
                    user.username,
                    user.email,
                    user.first_name,
                    user.last_name,
                    user.second_name or '',
                    role_names.get(user.role_id, 'Неизвестно'),
                    user.phone or '',
                    user.birth_date.strftime('%Y-%m-%d') if user.birth_date else '',
                    user.get_gender_display() if user.gender else '',
                    'Да' if user.is_active else 'Нет',
                    user.dt_add.strftime('%Y-%m-%d %H:%M:%S') if user.dt_add else '',
                    user.dt_upd.strftime('%Y-%m-%d %H:%M:%S') if user.dt_upd else '',
                    str(user.additional_info) if user.additional_info else ''
                ]
                writer.writerow(row)
            
            # Подготавливаем HTTP ответ
            output.seek(0)
            response = HttpResponse(
                output.getvalue(),
                content_type='text/csv; charset=utf-8'
            )
            
            filename = f'users_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            return Response(
                {"error": f"Ошибка при экспорте: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[CanManageUsers],
        url_path='admin/export/records'
    )
    def export_records(self, request):
        """Экспорт всех записей в CSV формате."""
        try:
            from ..records.models import Record
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Заголовки CSV
            headers = [
                'ID записи', 'Пациент', 'Email пациента', 'Специалист', 'Email специалиста',
                'Дата приема', 'Длительность (мин)', 'Статус', 'Заметки',
                'Дата создания', 'Дата обновления', 'Фактическая дата'
            ]
            writer.writerow(headers)
            
            # Получаем все записи с оптимизацией
            records = Record.objects.select_related('patient', 'dentist').all().order_by('-appointment_date')
            
            status_names = {
                'scheduled': 'Запланирован',
                'completed': 'Завершен',
                'canceled': 'Отменен'
            }
            
            for record in records:
                row = [
                    record.id,
                    f"{record.patient.first_name} {record.patient.last_name}",
                    record.patient.email,
                    f"{record.dentist.first_name} {record.dentist.last_name}",
                    record.dentist.email,
                    record.appointment_date.strftime('%Y-%m-%d %H:%M:%S'),
                    record.duration,
                    status_names.get(record.status, record.status),
                    record.notes or '',
                    record.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    record.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
                    record.actual_date.strftime('%Y-%m-%d %H:%M:%S') if record.actual_date else ''
                ]
                writer.writerow(row)
            
            output.seek(0)
            response = HttpResponse(
                output.getvalue(),
                content_type='text/csv; charset=utf-8'
            )
            
            filename = f'records_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response
            
        except Exception as e:
            return Response(
                {"error": f"Ошибка при экспорте записей: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        methods=['GET'],
        detail=False,
        permission_classes=[CanManageUsers],
        url_path='admin/users'
    )
    def admin_users_list(self, request):
        """Получение списка всех пользователей для администратора."""
        try:
            users = User.objects.all().order_by('-dt_add')
            
            # Применяем фильтры если они есть
            role_filter = request.query_params.get('role')
            if role_filter:
                role_id_map = {'admin': 1, 'patient': 2, 'specialist': 3}
                if role_filter in role_id_map:
                    users = users.filter(role_id=role_id_map[role_filter])
            
            is_active_filter = request.query_params.get('is_active')
            if is_active_filter is not None:
                users = users.filter(is_active=is_active_filter.lower() == 'true')
            
            # Пагинация
            page = self.paginate_queryset(users)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": f"Ошибка при получении пользователей: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        methods=['DELETE'],
        detail=True,
        permission_classes=[CanManageUsers],
        url_path='admin/delete'
    )
    def admin_delete_user(self, request, pk=None):
        """Удаление пользователя администратором."""
        try:
            user_to_delete = self.get_object()
            
            # Запрещаем удаление самого себя
            if user_to_delete.id == request.user.id:
                return Response(
                    {"error": "Нельзя удалить самого себя"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Запрещаем удаление других администраторов (безопасность)
            if user_to_delete.role_id == AdminRole.id:
                return Response(
                    {"error": "Нельзя удалить другого администратора"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Проверяем, есть ли связанные записи
            from ..records.models import Record
            related_records = Record.objects.filter(
                models.Q(patient=user_to_delete) | models.Q(dentist=user_to_delete)
            ).count()
            
            if related_records > 0:
                # Soft delete вместо полного удаления
                user_to_delete.is_active = False
                user_to_delete.save()
                return Response({
                    "message": f"Пользователь деактивирован (найдено {related_records} связанных записей)"
                })
            else:
                username = user_to_delete.username
                user_to_delete.delete()
                return Response({
                    "message": f"Пользователь {username} успешно удален"
                })
                
        except Exception as e:
            return Response(
                {"error": f"Ошибка при удалении пользователя: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        methods=['PATCH'],
        detail=True,
        permission_classes=[CanManageUsers],
        url_path='admin/toggle-active'
    )
    def admin_toggle_active(self, request, pk=None):
        """Активация/деактивация пользователя администратором."""
        try:
            user_to_toggle = self.get_object()
            
            # Запрещаем деактивацию самого себя
            if user_to_toggle.id == request.user.id:
                return Response(
                    {"error": "Нельзя деактивировать самого себя"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_to_toggle.is_active = not user_to_toggle.is_active
            user_to_toggle.save()
            
            status_text = "активирован" if user_to_toggle.is_active else "деактивирован"
            
            return Response({
                "message": f"Пользователь {user_to_toggle.username} {status_text}",
                "is_active": user_to_toggle.is_active
            })
            
        except Exception as e:
            return Response(
                {"error": f"Ошибка при изменении статуса пользователя: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )