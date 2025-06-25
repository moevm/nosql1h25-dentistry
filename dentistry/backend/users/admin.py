from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import CustomUser, AdminRole, ClientRole, DentistRole


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = (
        'id', 'username', 'email', 'first_name', 'last_name', 
        'get_role_display', 'is_active', 'is_staff', 'dt_add'
    )
    list_filter = ('role_id', 'is_active', 'is_staff', 'gender', 'dt_add')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    ordering = ('-dt_add',)
    readonly_fields = ('dt_add', 'dt_upd', 'last_login', 'date_joined')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('username', 'email', 'password')
        }),
        ('Персональная информация', {
            'fields': ('first_name', 'last_name', 'second_name', 'phone', 'birth_date', 'gender', 'avatar')
        }),
        ('Права доступа', {
            'fields': ('role_id', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Дополнительная информация', {
            'fields': ('additional_info',)
        }),
        ('Временные метки', {
            'fields': ('last_login', 'date_joined', 'dt_add', 'dt_upd'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Создание пользователя', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role_id', 'first_name', 'last_name'),
        }),
    )

    def get_role_display(self, obj):
        """Возвращает читаемое название роли с цветовой кодировкой."""
        role_colors = {
            1: '#e74c3c',  # Красный для админа
            2: '#3498db',  # Синий для клиента
            3: '#2ecc71',  # Зеленый для дантиста
        }
        role_names = {
            1: 'Администратор',
            2: 'Пациент',
            3: 'Специалист',
        }
        
        color = role_colors.get(obj.role_id, '#95a5a6')
        name = role_names.get(obj.role_id, 'Неизвестно')
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, name
        )
    get_role_display.short_description = 'Роль'
    get_role_display.admin_order_field = 'role_id'
    
    def get_queryset(self, request):
        """Возвращает queryset с оптимизацией."""
        return super().get_queryset(request).select_related()

    actions = ['make_active', 'make_inactive', 'reset_to_client_role']

    def make_active(self, request, queryset):
        """Активировать выбранных пользователей."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} пользователей активировано.')
    make_active.short_description = 'Активировать выбранных пользователей'

    def make_inactive(self, request, queryset):
        """Деактивировать выбранных пользователей."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} пользователей деактивировано.')
    make_inactive.short_description = 'Деактивировать выбранных пользователей'

    def reset_to_client_role(self, request, queryset):
        """Сбросить роль до клиента."""
        updated = queryset.update(role_id=ClientRole.id)
        self.message_user(request, f'{updated} пользователей переведено в роль клиента.')
    reset_to_client_role.short_description = 'Сбросить роль до "Пациент"'
