from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from djongo import models as djongo_models


class Role:
    """База для ролей."""

    id: int
    alias: str

    title: str

    schema: dict = {
        "fields": set(),
        "required_fields": set()
    }


class AdminRole(Role):
    """Администратор."""

    id: int = 1
    alias: str = 'admin'
    title: str = _('Admin')

    schema: dict = {
        "fields": {},
        "required_fields": {}
    }


class ClientRole(Role):
    """Клиент."""

    id: int = 2
    alias: str = 'client'
    title: str = _('Client')

    schema: dict = {
        "fields": {
            "allergy",
            "insurance_policy_number"
        },
        "required_fields": {}
    }


class DentistRole(Role):
    """Дантист."""

    id: int = 3
    alias: str = 'dentist'
    title: str = _('Dentist')

    schema: dict = {
        "fields": {
            "profession",
            "work_experience"
        },
        "required_fields": {
            "profession"
        }
    }

def get_role_by_id(id):
    return CustomUser.ROLES.get(id)


class CustomUser(AbstractUser):
    first_name = models.CharField(_('first name'), max_length=150, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    second_name = models.CharField(_('second name'), max_length=150, blank=True)
    GENDER_CHOICES = [
        ('male', 'Мужской'),
        ('female', 'Женский'),
        ('other', 'Другой'),
        ('unknown', 'Не указан'),
    ]

    gender = models.CharField(
        _('Пол'),
        max_length=10,
        choices=GENDER_CHOICES,
        default='unknown',
        blank=True,
        null=True,
    )
    email = models.EmailField('Электронная почта', unique=True)
    avatar = models.ImageField(
        upload_to='users/images/',
        default=None,
        verbose_name='Аватар',
    )
    
    phone = models.CharField(_('Телефон'), null=True, max_length=20)
    birth_date = models.DateField(_('Дата рождения'), null=True, blank=True)

    additional_info = models.JSONField(_('Доп. информация'), default=dict, blank=True)

    dt_add = models.DateTimeField(_('Дата добавления'), auto_now_add=True)
    dt_upd = models.DateTimeField(_('Дата обновления'), auto_now=True)

    role_id = models.PositiveIntegerField(_('Role'), default=ClientRole.id)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']

    ROLES = {
        AdminRole.id : AdminRole,
        ClientRole.id : ClientRole,
        DentistRole.id : DentistRole
    }

    class Meta:
        app_label = 'users'

    @property
    def current_role(self):
        """Возвращает роль для данного пользователя.

        """

        return self.ROLES.get(self.role_id)

    @property
    def is_admin(self) -> bool:
        """Флаг, указывающий на то, есть ли среди ролей пользователя роль администратора."""
        return bool(self.check_roles(roles=[AdminRole]))

    @property
    def is_client(self) -> bool:
        """Флаг, указывающий на то, есть ли среди ролей пользователя роль клиента."""
        return bool(self.check_roles(roles=[ClientRole]))

    @property
    def is_dentist(self) -> bool:
        """Флаг, указывающий на то, есть ли среди ролей пользователя роль клиента."""
        return bool(self.check_roles(roles=[DentistRole]))

    def check_roles(self, roles: list[type[Role]]) -> bool:
        """Проверяет, имеется ли у данного пользователя указанная роль.

        :param roles:

        """
        roles_current = self.current_role

        for role_type in roles:
            if roles_current ==  role_type:
                return True

        return False

User = get_user_model()