from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

User = get_user_model()


class CustomUserSerializer(UserSerializer):
    id = serializers.SerializerMethodField()
    avatar = Base64ImageField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        exclude = ('password',)

    def get_role(self, obj):
        """Возвращает роль пользователя как строку"""
        role_mapping = {
            1: 'admin',  # support -> admin
            2: 'patient',  # client -> patient
            3: 'specialist'  # dentist -> specialist
        }
        return role_mapping.get(obj.role_id, 'patient')

    def get_id(self, obj):
        # если используешь djongo или другой MongoDB адаптер, попробуй:
        return int(obj.pk)


class AvatarSerializer(CustomUserSerializer):
    class Meta:
        model = User
        fields = ('avatar', )