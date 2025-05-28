import django_filters
from .models import Record
from backend.users.models import CustomUser

class RecordFilter(django_filters.FilterSet):
    dentist = django_filters.NumberFilter(
        field_name='dentist__id',
        label='Dentist ID',
        help_text="Filter by dentist's ID"
    )
    patient = django_filters.NumberFilter(
        field_name='patient__id',
        label='Patient ID',
        help_text="Filter by patient's ID"
    )
    date_from = django_filters.DateFilter(
        field_name='appointment_date', 
        lookup_expr='gte',
        label='From Date (YYYY-MM-DD)'
    )
    date_to = django_filters.DateFilter(
        field_name='appointment_date', 
        lookup_expr='lte',
        label='To Date (YYYY-MM-DD)'
    )
    status = django_filters.ChoiceFilter(
        field_name='status',
        lookup_expr='iexact',
        choices=Record.STATUS_CHOICES,
        label='Status'
    )

    class Meta:
        model = Record
        fields = {
            'dentist': ['exact'],
            'patient': ['exact'],
            'status': ['exact'],
            'appointment_date': ['gte', 'lte'],
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.filters['status'].extra['help_text'] = f"Available statuses: {dict(Record.STATUS_CHOICES)}"