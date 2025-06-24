import django_filters
from datetime import datetime, timedelta
from .models import Record
from django.db import models
from django.utils import timezone

class RecordFilter(django_filters.FilterSet):
    dentist = django_filters.NumberFilter(
        field_name='dentist__id',
        label='Dentist ID',
        help_text="Filter by dentist's ID"
    )
    specialist = django_filters.CharFilter(
        method='filter_specialist_by_fullname',
        label='Dentist Name',
        help_text="Filter by dentist's full name"
    )
    patient = django_filters.NumberFilter(
        field_name='patient__id',
        label='Patient ID',
        help_text="Filter by patient's ID"
    )
    
    patient_name = django_filters.CharFilter(
        method='filter_patient_by_fullname',
        label='Patient Name',
        help_text="Filter by patient's full name"
    )

    date_from = django_filters.DateFilter(
        method='filter_date_from',
        label='From Date (YYYY-MM-DD)'
    )
    date_to = django_filters.DateFilter(
        method='filter_date_to',
        label='To Date (YYYY-MM-DD)'
    )

    status = django_filters.ChoiceFilter(
        field_name='status',
        lookup_expr='iexact',
        choices=Record.STATUS_CHOICES,
        label='Status'
    )

    show_past = django_filters.BooleanFilter(
        method='filter_show_past',
        label='Show Past Records'
    )

    class Meta:
        model = Record
        fields = ['dentist', 'specialist', 'patient', 'status', 'show_past']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.filters['status'].extra['help_text'] = f"Available statuses: {dict(Record.STATUS_CHOICES)}"

    def filter_date_from(self, queryset, name, value):
        return queryset.filter(appointment_date__gte=datetime.combine(value, datetime.min.time()))

    def filter_date_to(self, queryset, name, value):
        next_day = value + timedelta(days=1)
        return queryset.filter(appointment_date__lt=datetime.combine(next_day, datetime.min.time()))

    def filter_specialist_by_fullname(self, queryset, name, value):
        """Фильтрация по ФИО врача (частичный поиск)"""
        return queryset.filter(
            models.Q(dentist__first_name__icontains=value) |
            models.Q(dentist__last_name__icontains=value) |
            models.Q(dentist__second_name__icontains=value)
        )

    def filter_patient_by_fullname(self, queryset, name, value):
        """Фильтрация по ФИО пациента (частичный поиск)"""
        return queryset.filter(
            models.Q(patient__first_name__icontains=value) |
            models.Q(patient__last_name__icontains=value) |
            models.Q(patient__second_name__icontains=value)
        )

    def filter_show_past(self, queryset, name, value):
        """Фильтрация прошедших записей"""
        now = timezone.now()
        
        # Обрабатываем разные типы значений (булево, строка)
        if value in [False, 'false', '0', 0]:  # Скрываем прошедшие записи
            return queryset.filter(appointment_date__gte=now)
        elif value in [True, 'true', '1', 1]:  # Показываем все записи
            return queryset
        else:
            # По умолчанию показываем все записи
            return queryset
