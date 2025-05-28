# backend/records/admin.py
from django.contrib import admin
from .models import Record

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'dentist', 'patient', 'status', 'appointment_date', 'duration')
    list_filter = ('status', 'dentist', 'patient')
    search_fields = ('dentist__email', 'patient__email', 'notes')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'appointment_date'
    fieldsets = (
        ('Основная информация', {
            'fields': ('dentist', 'patient', 'status')
        }),
        ('Время приема', {
            'fields': ('appointment_date', 'duration', 'actual_date')
        }),
        ('Дополнительно', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )