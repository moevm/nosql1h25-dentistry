from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from backend.users.models import CustomUser

class Record(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Запланирован'),
        ('completed', 'Завершен'),
        ('canceled', 'Отменен'),
    ]

    dentist = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='dentist_records',
        limit_choices_to={'role_id': 3}  # только стоматологи
    )
    patient = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name='patient_records',
        limit_choices_to={'role_id': 2}  # только пациенты
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )
    appointment_date = models.DateTimeField()
    duration = models.PositiveIntegerField(default=30)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    actual_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Запись'
        verbose_name_plural = 'Записи'
        ordering = ['-appointment_date']
        indexes = [
            models.Index(fields=['dentist', 'appointment_date']),
            models.Index(fields=['patient', 'appointment_date']),
        ]

    def __str__(self):
        return f"Запись #{self.id} ({self.get_status_display()})"

    def clean(self):
        # Проверка даты на прошлое время
        if self.appointment_date < timezone.now():
            raise ValidationError("Дата приема не может быть в прошлом")

        # Проверка на пересечение времени (только для новых записей)
        if self._state.adding:  # Только для новых записей
            overlapping = Record.objects.filter(
                dentist=self.dentist,
                appointment_date__lt=self.appointment_date + timedelta(minutes=self.duration),
                appointment_date__gte=self.appointment_date
            ).exists()
            
            if overlapping:
                raise ValidationError("Это время уже занято другим приемом")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)