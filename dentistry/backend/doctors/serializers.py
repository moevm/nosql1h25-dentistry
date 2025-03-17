from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Doctor

User = get_user_model()

class DoctorSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role_id=3),
        source='user',
        write_only=True
    )

    class Meta:
        model = Doctor
        fields = [
            'id',
            'user',
            'user_id',
            'specialization',
            'license_number',
            'experience_years',
            'cabinet_number',
            'photo'
        ]
        read_only_fields = ['id']