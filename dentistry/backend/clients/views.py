from rest_framework import permissions, status
from ..users.models import CustomUser, ClientRole
from ..users.serializers import CustomUserSerializer
from ..users.views import CustomUserViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
import csv
import io
from ..users.paginations import PageLimitPagination

class ClientViewSet(CustomUserViewSet):
    queryset = CustomUser.objects.filter(role_id=ClientRole.id)
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]


    @action(detail=False, methods=['POST'], url_path='bulk', permission_classes=[permissions.IsAdminUser])
    def bulk_create(self, request):
        """Массовое создание пациентов из CSV файла."""
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "Файл не найден"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.reader(io_string)
            next(reader)  # Пропускаем заголовок
            
            created_count = 0
            errors = []

            for row in reader:
                try:
                    # Ожидаемый формат: email,password,first_name,last_name,second_name,phone,birth_date,gender
                    email, password, first_name, last_name, second_name, phone, birth_date, gender = row
                    
                    if CustomUser.objects.filter(email=email).exists():
                        errors.append(f"Пользователь с email {email} уже существует.")
                        continue

                    user = CustomUser.objects.create_user(
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        second_name=second_name,
                        phone=phone,
                        birth_date=birth_date or None,
                        gender=gender or 'unknown',
                        role_id=ClientRole.id,
                        username=email,
                    )
                    created_count += 1
                except Exception as e:
                    errors.append(f"Ошибка в строке {reader.line_num}: {str(e)}")

            return Response({
                "message": f"Загрузка завершена. Создано: {created_count} пациентов.",
                "errors": errors
            })

        except Exception as e:
            return Response({"error": f"Ошибка обработки файла: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    pagination_class = PageLimitPagination

