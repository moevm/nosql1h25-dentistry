from rest_framework import viewsets, permissions
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Админы видят всех врачей
        if self.request.user.is_superuser:
            return Doctor.objects.all()
        # Врачи видят только свой профиль
        elif self.request.user.user_type == 'doctor':
            return Doctor.objects.filter(user=self.request.user)
        # Остальные (пациенты) не имеют доступа
        return Doctor.objects.none()