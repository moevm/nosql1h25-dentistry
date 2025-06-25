from django.db import migrations
import json
from datetime import datetime


def create_users(apps, schema_editor):
    User = apps.get_model('users', 'CustomUser')

    users_data = [
        {
            "id": 0,
            "username": "admin",
            "email": "admin@dentistry.ru",
            "first_name": "Главный",
            "last_name": "Администратор",
            "second_name": "Системный",
            "password": "pbkdf2_sha256$260000$cTxm689kX6LIy5QaMPAYN4$xDAH6NDO+PM2ydS+dfChdUFv5VYZjczTsNgIk75Vq1k=",  #c2S-ZLn-hTx-8cy
            "is_superuser": True,
            "is_staff": True,
            "is_active": True,
            "last_login": None,
            "date_joined": datetime.fromisoformat("2025-01-01T12:00:00.000+00:00"),
            "dt_add": datetime.fromisoformat("2025-01-01T12:00:00.000+00:00"),
            "dt_upd": datetime.fromisoformat("2025-01-01T12:00:00.000+00:00"),
            "role_id": 1,  # AdminRole
            "additional_info": {
                "department": "IT",
                "access_level": "full"
            },
        },
        {
            "id": 1,
            "username": "van1kov",
            "email": "van1kov@mail.ru",
            "first_name": "ярик",
            "last_name": "ваньков",
            "second_name": "",
            "password": "pbkdf2_sha256$260000$whK9urHXrqsIMBlnddvSBX$yYjXSYP7pMGbmqTzdCSNff8ydTP2pnQVh/TpBubDINE=",
            "is_superuser": False,
            "is_staff": False,
            "is_active": True,
            "last_login": datetime.fromisoformat("2025-05-29T12:09:51.354+00:00"),
            "date_joined": datetime.fromisoformat("2025-05-29T12:09:44.697+00:00"),
            "dt_add": datetime.fromisoformat("2025-05-29T12:09:44.752+00:00"),
            "dt_upd": datetime.fromisoformat("2025-05-29T20:09:43.525+00:00"),
            "role_id": 2,
            "additional_info": {},
        },
        {
            "id": 2,
            "username": "van1kov_doctor",
            "email": "van1kovDOC@mail.ru",
            "first_name": "DOC",
            "last_name": "DOCROTSURNAME",
            "second_name": "",
            "password": "pbkdf2_sha256$260000$czjvMfw1hI0mmnGlLSksnG$BUJWH6a957tPzpFL04uxh7TeOXgsCOtAhDT9/baBcKo=",
            "is_superuser": False,
            "is_staff": False,
            "is_active": True,
            "last_login": None,
            "date_joined": datetime.fromisoformat("2025-05-29T12:15:28.507+00:00"),
            "dt_add": datetime.fromisoformat("2025-05-29T12:15:28.575+00:00"),
            "dt_upd": datetime.fromisoformat("2025-05-29T12:17:34.924+00:00"),
            "role_id": 3,
            "additional_info": {
                "profession": "Терапевт",
                "work_experience": "20 лет"
            },
        },
        {
            "id": 3,
            "username": "KUZYA",
            "email": "van11kov@mail.com",
            "first_name": "Ярослав",
            "last_name": "Ваньков",
            "second_name": "Сергеевич",
            "password": "pbkdf2_sha256$260000$cTxm689kX6LIy5QaMPAYN4$xDAH6NDO+PM2ydS+dfChdUFv5VYZjczTsNgIk75Vq1k=",
            "is_superuser": False,
            "is_staff": False,
            "is_active": True,
            "last_login": datetime.fromisoformat("2025-05-29T20:53:54.279+00:00"),
            "date_joined": datetime.fromisoformat("2025-05-29T20:08:47.893+00:00"),
            "dt_add": datetime.fromisoformat("2025-05-29T20:08:47.948+00:00"),
            "dt_upd": datetime.fromisoformat("2025-05-29T20:40:09.760+00:00"),
            "role_id": 3,
            "birth_date": datetime.fromisoformat("2004-09-18"),
            "phone": "+79608600232",
            "additional_info": {
                "profession": "Терапевт",
                "work_experience": "20 лет"
            },
        },
        {
            "id": 4,
            "username": "clien123",
            "email": "client@mail.ru",
            "first_name": "обычный",
            "last_name": "человек",
            "second_name": "Сергеевич",
            "password": "pbkdf2_sha256$260000$Bqv29eQM5MorNgSh9KBv2O$XALvvaBgUpAjPIuOTAmXv5uvGtwi9lAEte7pXBh8TsE=",
            "is_superuser": False,
            "is_staff": False,
            "is_active": True,
            "last_login": datetime.fromisoformat("2025-05-29T20:57:47.963+00:00"),
            "date_joined": datetime.fromisoformat("2025-05-29T20:45:55.755+00:00"),
            "dt_add": datetime.fromisoformat("2025-05-29T20:45:55.806+00:00"),
            "dt_upd": datetime.fromisoformat("2025-05-29T20:50:55.654+00:00"),
            "role_id": 2,
            "birth_date": datetime.fromisoformat("2004-09-18"),
            "gender": "male",
            "phone": "1769608600232",
            "additional_info": {},
        },
    ]

    for user_data in users_data:
        User.objects.update_or_create(
            id=user_data["id"],
            defaults=user_data
        )


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_customuser_options'),
    ]

    operations = [
        migrations.RunPython(create_users),
    ]
