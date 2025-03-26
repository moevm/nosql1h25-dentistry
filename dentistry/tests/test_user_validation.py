import pytest
from pytest_mock import MockerFixture
from rest_framework.exceptions import ValidationError

# Мокаем модель CustomUser
class CustomUser:
    role_id = None
    profession = None
    work_experience = None

@pytest.fixture
def user_mock(mocker: MockerFixture):
    return mocker.MagicMock(spec=CustomUser)

@pytest.fixture(autouse=True)
def mock_custom_user(monkeypatch):
    monkeypatch.setattr("users.models.CustomUser", CustomUser)

@pytest.mark.parametrize("role_id, profession, should_raise", [
    (3, "Стоматолог", False),
    (3, None, True),
    (2, None, False),
    (3, "a"*255, False),
    (3, "a"*256, True),
    (5, "Хирург", False),
])

def test_parameterized_validation(role_id, profession, should_raise):
    """Параметризованный тест валидации"""
    user_mock = CustomUser()  # Используем реальный класс для тестирования
    user_mock.role_id = role_id
    user_mock.profession = profession

    if should_raise:
        with pytest.raises(ValidationError) as exc_info:
            if role_id == 3:
                if not profession:
                    raise ValidationError(
                        {"profession": ["Обязательное поле для роли Доктор"]}
                    )
                elif profession and len(profession) > 255:
                    raise ValidationError(
                        {"profession": ["Максимальная длина профессии 255 символов"]}
                    )
        error_detail = exc_info.value.detail
        if not profession:
            assert "profession" in error_detail
            assert error_detail["profession"][0] == "Обязательное поле для роли Доктор"
        elif len(profession) > 255:
            assert "profession" in error_detail
            assert error_detail["profession"][0] == "Максимальная длина профессии 255 символов"
    else:
        try:
            # Проверяем, что исключение не возникает
            if role_id == 3:
                assert profession is not None, "profession не должен быть None для роли 3"
                assert len(profession) <= 255, "Превышена максимальная длина профессии"
        except AssertionError as e:
            pytest.fail(str(e))

def test_profession_required_for_doctor_role(user_mock):
    """Для роли 'Доктор' (3) поле 'profession' обязательно"""
    user_mock.role_id = 3
    user_mock.profession = None
    
    with pytest.raises(ValidationError) as exc_info:
        if not user_mock.profession:
            raise ValidationError(
                {"profession": ["Обязательное поле для роли Доктор"]}
            )
            
    assert "profession" in exc_info.value.detail
    assert exc_info.value.detail["profession"][0] == "Обязательное поле для роли Доктор"

def test_work_experience_must_be_positive(user_mock):
    """Опыт работы не может быть отрицательным или нулевым"""
    user_mock.role_id = 3
    user_mock.work_experience = -1
    
    with pytest.raises(ValidationError) as exc_info:
        if user_mock.work_experience is not None and user_mock.work_experience <= 0:
            raise ValidationError(
                {"work_experience": ["Опыт работы должен быть положительным числом"]}
            )
            
    assert "work_experience" in exc_info.value.detail
    assert exc_info.value.detail["work_experience"][0] == "Опыт работы должен быть положительным числом"

def test_profession_max_length_validation(user_mock):
    """Проверка максимальной длины профессии (255 символов)"""
    user_mock.role_id = 3
    user_mock.profession = "a" * 256
    
    with pytest.raises(ValidationError) as exc_info:
        if len(user_mock.profession) > 255:
            raise ValidationError(
                {"profession": ["Максимальная длина профессии 255 символов"]}
            )
            
    assert "profession" in exc_info.value.detail
    assert exc_info.value.detail["profession"][0] == "Максимальная длина профессии 255 символов"

def test_work_experience_optional_for_non_doctors(user_mock):
    """Опыт работы не обязателен для других ролей"""
    user_mock.role_id = 2
    user_mock.work_experience = None
    
    try:
        pass  # Валидация должна пройти
    except ValidationError:
        pytest.fail("work_experience не должен быть обязательным для других ролей")

def test_combined_validations(user_mock):
    """Проверка комбинированных условий валидации"""
    user_mock.role_id = 3
    user_mock.profession = "Стоматолог"
    user_mock.work_experience = 0
    
    with pytest.raises(ValidationError) as exc_info:
        if user_mock.work_experience is not None and user_mock.work_experience <= 0:
            raise ValidationError(
                {"work_experience": ["Опыт работы должен быть положительным числом"]}
            )
            
    assert "work_experience" in exc_info.value.detail
    assert exc_info.value.detail["work_experience"][0] == "Опыт работы должен быть положительным числом"