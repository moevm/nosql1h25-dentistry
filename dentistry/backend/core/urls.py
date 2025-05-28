from django.conf import settings
from django.http import JsonResponse
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from ..users.models import CustomUser, DentistRole

def ping(request):
    from django.urls import get_resolver
    resolver = get_resolver()
    all_urls = [str(u.pattern) for u in resolver.url_patterns]
    print(all_urls)
    return JsonResponse({'ok': 'ok', 'urls': all_urls})

urlpatterns = [
    path('ping/', ping),
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/', include([
        path('users/', include(('backend.users.urls', 'users'), namespace='users')),
        path('clients/', include(('backend.clients.urls', 'clients'), namespace='clients')),
        path('dentists/', include(('backend.dentists.urls', 'dentists'), namespace='dentists')),
        path('records/', include(('backend.records.urls', 'records'), namespace='records')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
