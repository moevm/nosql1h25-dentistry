import base64
import os

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from djoser.views import UserViewSet
from rest_framework import permissions, serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .paginations import PageLimitPagination

from .serializers import AvatarSerializer
from .models import get_role_by_id

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