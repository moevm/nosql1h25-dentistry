import base64
import os

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from djoser.views import UserViewSet
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .paginations import PageLimitPagination

from .serializers import AvatarSerializer

User = get_user_model()


class CustomUserViewSet(UserViewSet):
    pagination_class = PageLimitPagination

    def get_permissions(self):
        if self.action in ['retrieve', 'list']:
            return (permissions.IsAuthenticatedOrReadOnly(), )
        return super().get_permissions()

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

    def perform_update(self, serializer):
        user = self.request.user
        data = serializer.validated_data

        if not self.request.user.is_support and 'role_id' in data:
            return Response({"errors": "У вас нет прав"}, status=403)

        role_id = data.get('role_id', user.role_id)
        role_class = user.ROLES.get(role_id)

        if not role_class:
            raise ValidationError({"role_id": "Неизвестная роль"})

        schema = role_class.schema
        allowed_fields = schema.get("fields", set())
        required_fields = schema.get("required_fields", set())

        # Получаем additional_info (новое или текущее)
        additional_info = data.get('additional_info', user.additional_info or {})

        if additional_info:
            info_keys = set(additional_info.keys())

            extra_fields = info_keys - allowed_fields
            missing_fields = required_fields - info_keys

            if extra_fields:
                raise ValidationError({
                    "additional_info": f"Недопустимые поля: {', '.join(extra_fields)}"
                })
            if missing_fields:
                raise ValidationError({
                    "additional_info": f"Обязательные поля отсутствуют: {', '.join(missing_fields)}"
                })

        super().perform_update(serializer)