from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

User = get_user_model()


class CustomUserSerializer(UserSerializer):
    avatar = Base64ImageField()

    class Meta:
        model = User
        fields = (
            'email', 'id', 'username', 'first_name', 'last_name', 'avatar', 'role_id'
        )



class AvatarSerializer(CustomUserSerializer):
    class Meta:
        model = User
        fields = ('avatar', )