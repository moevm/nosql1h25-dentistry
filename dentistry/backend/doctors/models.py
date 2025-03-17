from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Doctor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_profile',
        limit_choices_to={'role_id': 3}
    )
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=20, unique=True)
    experience_years = models.PositiveIntegerField()
    cabinet_number = models.CharField(max_length=10)
    photo = models.ImageField(upload_to='doctors/', blank=True, null=True)

    def __str__(self):
        return f"Доктор {self.user.first_name} {self.user.last_name} ({self.specialization})"