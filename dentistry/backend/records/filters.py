import django_filters
from .models import Record
from backend.users.models import CustomUser

class RecordFilter(django_filters.FilterSet):
    dentist = django_filters.CharFilter(
        field_name='dentist__email',
        lookup_expr='iexact'
    )
    patient = django_filters.CharFilter(
        field_name='patient__email',
        lookup_expr='iexact'
    )
    date_from = django_filters.DateFilter(
        field_name='appointment_date', 
        lookup_expr='gte'
    )
    date_to = django_filters.DateFilter(
        field_name='appointment_date', 
        lookup_expr='lte'
    )
    status = django_filters.CharFilter(
        field_name='status',
        lookup_expr='iexact'
    )

    class Meta:
        model = Record
        fields = ['dentist', 'patient', 'status']