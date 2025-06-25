# backend/records/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Record

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'get_patient_name', 'get_dentist_name', 
        'appointment_date', 'get_status_display', 'duration', 'created_at'
    )
    list_filter = ('status', 'appointment_date', 'created_at', 'dentist__role_id')
    search_fields = (
        'patient__first_name', 'patient__last_name', 'patient__email',
        'dentist__first_name', 'dentist__last_name', 'dentist__email',
        'notes'
    )
    ordering = ('-appointment_date',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('dentist', 'patient', 'appointment_date', 'duration')
        }),
        ('Статус и заметки', {
            'fields': ('status', 'notes', 'actual_date')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_patient_name(self, obj):
        """Возвращает полное имя пациента."""
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    get_patient_name.short_description = 'Пациент'
    get_patient_name.admin_order_field = 'patient__last_name'

    def get_dentist_name(self, obj):
        """Возвращает полное имя дантиста."""
        return f"{obj.dentist.first_name} {obj.dentist.last_name}"
    get_dentist_name.short_description = 'Специалист'
    get_dentist_name.admin_order_field = 'dentist__last_name'

    def get_status_display(self, obj):
        """Возвращает статус с цветовой кодировкой."""
        status_colors = {
            'scheduled': '#f39c12',  # Оранжевый для запланированных
            'completed': '#27ae60',  # Зеленый для завершенных
            'canceled': '#e74c3c',   # Красный для отмененных
        }
        
        color = status_colors.get(obj.status, '#95a5a6')
        display_name = obj.get_status_display()
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, display_name
        )
    get_status_display.short_description = 'Статус'
    get_status_display.admin_order_field = 'status'

    def get_queryset(self, request):
        """Возвращает queryset с оптимизацией."""
        return super().get_queryset(request).select_related('patient', 'dentist')

    actions = ['mark_as_completed', 'mark_as_canceled', 'mark_as_scheduled']

    def mark_as_completed(self, request, queryset):
        """Отметить записи как завершенные."""
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} записей отмечено как завершенные.')
    mark_as_completed.short_description = 'Отметить как завершенные'

    def mark_as_canceled(self, request, queryset):
        """Отметить записи как отмененные."""
        updated = queryset.update(status='canceled')
        self.message_user(request, f'{updated} записей отмечено как отмененные.')
    mark_as_canceled.short_description = 'Отметить как отмененные'

    def mark_as_scheduled(self, request, queryset):
        """Отметить записи как запланированные."""
        updated = queryset.update(status='scheduled')
        self.message_user(request, f'{updated} записей отмечено как запланированные.')
    mark_as_scheduled.short_description = 'Отметить как запланированные'