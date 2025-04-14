from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from drf_extra_fields.fields import Base64ImageField

User = get_user_model()


class CustomUserSerializer(UserSerializer):
    avatar = Base64ImageField()

    class Meta:
        model = User
        exclude = ('password',)



class AvatarSerializer(CustomUserSerializer):
    class Meta:
        model = User
        fields = ('avatar', )