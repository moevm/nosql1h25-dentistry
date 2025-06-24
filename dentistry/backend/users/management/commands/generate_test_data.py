from django.core.management.base import BaseCommand
from backend.users.models import CustomUser, ClientRole, DentistRole
from backend.records.models import Record
from django.utils import timezone
from random import randint, choice
from datetime import timedelta

class Command(BaseCommand):
    help = 'Генерирует тестовых пользователей (пациентов и стоматологов) и записи для проверки пагинации.'

    def handle(self, *args, **kwargs):
        # Создание 15 пациентов
        patients = []
        for i in range(15):
            patient, _ = CustomUser.objects.get_or_create(
                username=f'test_patient_{i}',
                defaults={
                    'email': f'test_patient_{i}@mail.ru',
                    'first_name': f'Имя{i}',
                    'last_name': f'Фамилия{i}',
                    'role_id': ClientRole.id,
                    'is_active': True,
                    'additional_info': {'allergy': f'Аллергия {i}', 'insurance_policy_number': f'1000{i}'}
                }
            )
            patients.append(patient)

        # Создание 15 стоматологов
        dentists = []
        for i in range(15):
            dentist, _ = CustomUser.objects.get_or_create(
                username=f'test_dentist_{i}',
                defaults={
                    'email': f'test_dentist_{i}@mail.ru',
                    'first_name': f'Доктор{i}',
                    'last_name': f'Зубов{i}',
                    'role_id': DentistRole.id,
                    'is_active': True,
                    'additional_info': {'profession': f'Профессия {i}', 'work_experience': f'{randint(1, 30)} лет'}
                }
            )
            dentists.append(dentist)

        # Получаем реальных врачей из базы данных (role_id=3)
        real_dentists = CustomUser.objects.filter(role_id=DentistRole.id, username__in=['van1kov_doctor', 'KUZYA'])
        
        # Создание 30 записей (Record) с реальными врачами
        for i in range(30):
            patient = choice(patients)
            dentist = choice(real_dentists) if real_dentists.exists() else choice(dentists)
            appointment_date = timezone.now() + timedelta(days=i+1)
            Record.objects.get_or_create(
                dentist=dentist,
                patient=patient,
                appointment_date=appointment_date,
                defaults={
                    'status': choice(['scheduled', 'completed', 'canceled']),
                    'duration': randint(20, 60),
                    'notes': f'Тестовая запись {i}',
                }
            )

        self.stdout.write(self.style.SUCCESS('Тестовые пациенты, стоматологи и записи успешно созданы!')) 