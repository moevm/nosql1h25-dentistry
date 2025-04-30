from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
    path('api/', include([
        path('clients/', include(('backend.clients.urls', 'clients'), namespace='clients')),
        path('dentists/', include(('backend.dentists.urls', 'dentists'), namespace='dentists')),
        path('records/', include(('backend.records.urls', 'records'), namespace='records')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
