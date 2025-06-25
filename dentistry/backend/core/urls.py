from django.conf import settings
from django.http import JsonResponse
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from ..users.models import CustomUser, DentistRole
import os

def ping(request):
    from django.urls import get_resolver
    resolver = get_resolver()
    all_urls = [str(u.pattern) for u in resolver.url_patterns]
    print(all_urls)
    MONGO_HOST = os.getenv('MONGO_HOST', 'mongo')
    MONGO_PORT = int(os.getenv('MONGO_PORT', '27017'))
    MONGO_NAME = os.getenv('MONGO_NAME', 'dentistry_db')
    MONGO_DB_USER = os.getenv('MONGO_DB_USER')
    MONGO_DB_PASSWORD = os.getenv('MONGO_DB_PASSWORD')
    MONGO_AUTH_SOURCE = os.getenv('MONGO_AUTH_SOURCE', MONGO_NAME)

    DATABASES = {
        'default': {
            'ENGINE': 'djongo',
            'NAME': MONGO_NAME,
            'USER': MONGO_DB_USER,
            'PASSWORD': MONGO_DB_PASSWORD,
            'HOST': MONGO_HOST,
            'PORT': MONGO_PORT,
        }
    }

    return JsonResponse(DATABASES)

urlpatterns = [
    path('ping/', ping),
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/', include([
        path('admin/', include(('backend.adminpanel.urls', 'adminpanel'), namespace='adminpanel')),
        path('users/', include(('backend.users.urls', 'users'), namespace='users')),
        path('clients/', include(('backend.clients.urls', 'clients'), namespace='clients')),
        path('dentists/', include(('backend.dentists.urls', 'dentists'), namespace='dentists')),
        path('records/', include(('backend.records.urls', 'records'), namespace='records')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
