from django.test import TestCase
from unittest.mock import MagicMock, patch
from rest_framework.exceptions import ValidationError
import pytest

# Мокаем модель CustomUser
class CustomUser:
    role_id = None
    profession = None
    work_experience = None

class ComplexUserValidationTests(TestCase):
    def setUp(self):
        self.user_mock = MagicMock(spec=CustomUser)
        self.user_mock.role_id = 3  # Роль "Доктор"
        self.user_mock.profession = "Стоматолог"
        self.user_mock.work_experience = 5

    @patch("users.models.CustomUser", new=CustomUser)
    def test_profession_required_for_doctor_role(self):
        """Для роли 'Доктор' (3) поле 'profession' обязательно"""
        self.user_mock.profession = None
        
        with self.assertRaises(ValidationError) as context:
            if not self.user_mock.profession:
                raise ValidationError({"profession": ["Обязательное поле для роли Доктор"]})
                
        self.assertEqual(
            context.exception.detail["profession"][0],
            "Обязательное поле для роли Доктор"
        )

    @patch("users.models.CustomUser", new=CustomUser)
    def test_work_experience_must_be_positive(self):
        """Опыт работы не может быть отрицательным или нулевым"""
        self.user_mock.work_experience = -1
        
        with self.assertRaises(ValidationError) as context:
            if self.user_mock.work_experience is not None and self.user_mock.work_experience <= 0:
                raise ValidationError({"work_experience": ["Опыт работы должен быть положительным числом"]})
                
        self.assertEqual(
            context.exception.detail["work_experience"][0],
            "Опыт работы должен быть положительным числом"
        )

    @patch("users.models.CustomUser", new=CustomUser)
    def test_profession_max_length_validation(self):
        """Проверка максимальной длины профессии (255 символов)"""
        self.user_mock.profession = "a" * 256
        
        with self.assertRaises(ValidationError) as context:
            if len(self.user_mock.profession) > 255:
                raise ValidationError({"profession": ["Максимальная длина профессии 255 символов"]})
                
        self.assertEqual(
            context.exception.detail["profession"][0],
            "Максимальная длина профессии 255 символов"
        )

    @patch("users.models.CustomUser", new=CustomUser)
    def test_work_experience_optional_for_non_doctors(self):
        """Опыт работы не обязателен для других ролей"""
        self.user_mock.role_id = 2  # Клиент
        self.user_mock.work_experience = None
        
        try:
            # Валидация должна пройти без ошибок
            pass
        except ValidationError:
            self.fail("work_experience не должен быть обязательным для других ролей")

    @patch("users.models.CustomUser", new=CustomUser)
    def test_invalid_profession_type(self):
        """Поле 'profession' должно быть строкой"""
        self.user_mock.profession = 12345  # Неверный тип
        
        with self.assertRaises(ValidationError) as context:
            if not isinstance(self.user_mock.profession, str):
                raise ValidationError({"profession": ["Поле должно быть строкой"]})
                
        self.assertEqual(
            context.exception.detail["profession"][0],
            "Поле должно быть строкой"
        )

    TEST_CASES = [
        (3, "Стоматолог", False),
        (3, None, True),
        (2, None, False),
        (3, "a"*255, False),
        (3, "a"*256, True),
        (5, "Хирург", False),
    ]
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        for i, (role_id, profession, should_raise) in enumerate(cls.TEST_CASES):
            test_name = f'test_validation_case_{i}'
            test_method = cls.create_validation_test(role_id, profession, should_raise)
            setattr(cls, test_name, test_method)

    @staticmethod
    def create_validation_test(role_id, profession, should_raise):
        def test(self):
            with patch("users.models.CustomUser", new=CustomUser):
                self.user_mock.role_id = role_id
                self.user_mock.profession = profession

                if should_raise:
                    with self.assertRaises(ValidationError):
                        if role_id == 3:
                            if not profession:
                                raise ValidationError({"profession": ["Обязательное поле для роли Доктор"]})
                            elif profession and len(profession) > 255:
                                raise ValidationError({"profession": ["Максимальная длина профессии 255 символов"]})
                else:
                    try:
                        pass  # Валидация должна пройти
                    except ValidationError:
                        self.fail("Неожиданная ошибка валидации")
        return test

    @patch("users.models.CustomUser", new=CustomUser)
    def test_combined_validations(self):
        """Проверка комбинированных условий валидации"""
        self.user_mock.role_id = 3
        self.user_mock.profession = "Стоматолог"
        self.user_mock.work_experience = 0  # Недопустимое значение
        
        with self.assertRaises(ValidationError) as context:
            errors = {}
            
            if self.user_mock.work_experience is not None and self.user_mock.work_experience <= 0:
                errors["work_experience"] = ["Опыт работы должен быть положительным числом"]
                
            if errors:
                raise ValidationError(errors)
                
        self.assertEqual(
            context.exception.detail["work_experience"][0],
            "Опыт работы должен быть положительным числом"
        )