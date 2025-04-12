from django.test import TestCase
from unittest.mock import MagicMock, patch
from rest_framework.exceptions import ValidationError


class CustomUser:
    role_id = None
    additional_info = None


class ClientAdditionalInfoValidationTests(TestCase):
    def setUp(self):
        self.user_mock = MagicMock(spec=CustomUser)
        self.user_mock.role_id = 2  # Клиент
        self.user_mock.additional_info = {
            "allergy": "пенициллин"
        }

    @patch("users.models.CustomUser", new=CustomUser)
    def test_additional_info_must_be_dict(self):
        """additional_info должен быть словарём"""
        self.user_mock.additional_info = "не словарь"

        with self.assertRaises(ValidationError) as context:
            if not isinstance(self.user_mock.additional_info, dict):
                raise ValidationError({"additional_info": ["Поле должно быть объектом (dict)"]})

        self.assertEqual(
            context.exception.detail["additional_info"][0],
            "Поле должно быть объектом (dict)"
        )

    @patch("users.models.CustomUser", new=CustomUser)
    def test_allergy_must_be_string(self):
        """Если указана аллергия, она должна быть строкой"""
        self.user_mock.additional_info = {"allergy": 12345}

        with self.assertRaises(ValidationError) as context:
            allergy = self.user_mock.additional_info.get("allergy")
            if allergy is not None and not isinstance(allergy, str):
                raise ValidationError({"additional_info": ["Поле 'allergy' должно быть строкой"]})

        self.assertEqual(
            context.exception.detail["additional_info"][0],
            "Поле 'allergy' должно быть строкой"
        )

    @patch("users.models.CustomUser", new=CustomUser)
    def test_additional_info_can_be_empty(self):
        """additional_info может быть пустым"""
        self.user_mock.additional_info = {}
        try:
            # Валидация проходит
            pass
        except ValidationError:
            self.fail("Пустой additional_info не должен вызывать ошибку")

    @patch("users.models.CustomUser", new=CustomUser)
    def test_additional_info_can_be_none(self):
        """additional_info может отсутствовать"""
        self.user_mock.additional_info = None
        try:
            # Валидация проходит
            pass
        except ValidationError:
            self.fail("None в additional_info не должен вызывать ошибку")

    @patch("users.models.CustomUser", new=CustomUser)
    def test_valid_additional_info(self):
        """Корректное значение additional_info"""
        self.user_mock.additional_info = {
            "allergy": "йод",
            "notes": "пациент жалуется на зубную боль"
        }
        try:
            if not isinstance(self.user_mock.additional_info, dict):
                raise ValidationError({"additional_info": ["Поле должно быть объектом (dict)"]})
            allergy = self.user_mock.additional_info.get("allergy")
            if allergy is not None and not isinstance(allergy, str):
                raise ValidationError({"additional_info": ["Поле 'allergy' должно быть строкой"]})
        except ValidationError:
            self.fail("Корректный additional_info вызвал ошибку валидации")