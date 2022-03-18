
from django.contrib import admin
from django.urls import include, path

app_name = 'api_crud'
urlpatterns = [
    path('api/v1/movies/', include('movies.urls')),
    path('api/v1/auth/', include('authentication.urls')),
    path('admin/', admin.site.urls),
]
