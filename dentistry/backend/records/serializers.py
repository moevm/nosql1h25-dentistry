from rest_framework import serializers
from django.utils import timezone
from .models import Record
from ..users.models import CustomUser


class RecordSerializer(serializers.ModelSerializer):
    dentist = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role_id=3)
    )
    patient = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role_id=2),
        required=False,  # не обязательно при создании, если ставим из request.user
        allow_null=True
    )

    class Meta:
        model = Record
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, data):
        request = self.context.get('request')

        # Для пациентов автоматически устанавливаем пациента
        if request and request.user.role_id == 2:
            data['patient'] = request.user

        # Для админов проверяем что указан стоматолог
        elif request and request.user.is_staff and 'dentist' not in data:
            raise serializers.ValidationError({
                'dentist': 'Admin must specify dentist when creating record'
            })

        # Для стоматологов автоматически устанавливаем стоматолога
        elif request and request.user.role_id == 3:
            data['dentist'] = request.user

        # Проверка даты: дата не в прошлом
        appointment_date = data.get('appointment_date')
        if appointment_date and appointment_date < timezone.now():
            raise serializers.ValidationError({
                'appointment_date': 'Appointment date cannot be in the past'
            })

        return data
